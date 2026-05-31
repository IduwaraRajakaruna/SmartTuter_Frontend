import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/app/components/stat-card';
import { TeacherApprovalDialog } from '@/app/components/teacher-approval-dialog';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { Users, GraduationCap, CreditCard, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { mockStudents, mockClasses } from '@/app/lib/mock-data';
import { TeacherApproval } from '@/app/lib/teacher-approvals';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { toast } from 'sonner';
import axios from 'axios';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { getStoredPayments, seedPayments } from '@/app/lib/payments-storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherApproval[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherApproval | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/teachers`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setTeachers(response.data?.teachers || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load teacher approvals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const pendingTeachers = teachers.filter(t => t.status === 'pending');
  seedPayments();
  const allPayments = getStoredPayments();

  const totalRevenue = allPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const recentTransactions = [...allPayments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pendingPayments = allPayments.filter(p => p.status === 'pending');

  const handleApprovalAction = (teacher: TeacherApproval, action: 'approve' | 'reject') => {
    setSelectedTeacher(teacher);
    setApprovalAction(action);
    setIsDialogOpen(true);
  };

  const handleConfirmApproval = async (teacherId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/teachers/${teacherId}/status`,
        { action, reason },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const updatedTeacher = response.data?.teacher;
      if (updatedTeacher) {
        setTeachers(prev => prev.map(t => (t.id === teacherId ? { ...t, ...updatedTeacher } : t)));
      }

      toast.success(
        action === 'approve'
          ? 'Teacher approved successfully!'
          : 'Teacher application rejected'
      );
    } catch (error) {
      console.error(error);
      toast.error('Unable to update teacher status.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={mockStudents.length}
          icon={Users}
          description="Active users"
          trend={{ value: 15, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={GraduationCap}
          description={`${pendingTeachers.length} pending approval`}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs ${totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          description="This month"
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Active Classes"
          value={mockClasses.filter(c => c.status === 'active').length}
          icon={FileText}
          description={`${mockClasses.length} total`}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2" />
        <StudentThemeToggle />
      </div>

      {/* Alerts */}
      {!isLoading && pendingTeachers.length > 0 && (
        <Card className="border-red-400 bg-gray-400">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-sm text-white">
              You have {pendingTeachers.length} teacher approval{pendingTeachers.length > 1 ? 's' : ''} pending review
            </p>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => navigate('/admin/approvals')}
            >
              Review Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Teacher Approvals */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <LoadingSpinner label="Loading approvals" />
          </CardContent>
        </Card>
      ) : pendingTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Teacher Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.experience} years</TableCell>
                    <TableCell>{teacher.joinedDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprovalAction(teacher, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApprovalAction(teacher, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <TeacherApprovalDialog
        teacher={selectedTeacher}
        action={approvalAction}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmApproval}
      />

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>{payment.className}</TableCell>
                  <TableCell>Rs {payment.amount}</TableCell>
                  <TableCell className="capitalize">{payment.method}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payment.status === 'completed'
                          ? 'bg-green-500/10 text-green-700 border-green-200'
                          : payment.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
                          : 'bg-red-500/10 text-red-700 border-red-200'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Students</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: '70%' }} />
                  </div>
                  <span className="text-sm">70%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Teachers</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-full" style={{ width: '30%' }} />
                  </div>
                  <span className="text-sm">30%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Classes</span>
                <Badge className="bg-green-500/10 text-green-700 border-green-200">
                  {mockClasses.filter(c => c.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Upcoming Classes</span>
                <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                  {mockClasses.filter(c => c.status === 'upcoming').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Classes</span>
                <Badge className="bg-gray-500/10 text-gray-700 border-gray-200">
                  {mockClasses.filter(c => c.status === 'completed').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}