import { useState } from 'react';
import { StatCard } from '@/app/components/stat-card';
import { TeacherApprovalDialog } from '@/app/components/teacher-approval-dialog';
import { Users, GraduationCap, CreditCard, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { mockTeachers, mockStudents, mockPayments, mockClasses, Teacher } from '@/app/lib/mock-data';
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

export function AdminDashboard() {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingTeachers = teachers.filter(t => t.status === 'pending');
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');

  const handleApprovalAction = (teacher: Teacher, action: 'approve' | 'reject') => {
    setSelectedTeacher(teacher);
    setApprovalAction(action);
    setIsDialogOpen(true);
  };

  const handleConfirmApproval = (teacherId: string, action: 'approve' | 'reject', reason?: string) => {
    // Update teacher status
    setTeachers(prev => prev.map(t => 
      t.id === teacherId 
        ? { ...t, status: action === 'approve' ? 'active' : 'inactive' } 
        : t
    ));

    // Mock API call - in real app this would call backend
    console.log(`${action} teacher ${teacherId}`, reason);

    toast.success(
      action === 'approve' 
        ? 'Teacher approved successfully!' 
        : 'Teacher application rejected'
    );
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
          value={mockTeachers.length}
          icon={GraduationCap}
          description={`${pendingTeachers.length} pending approval`}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
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

      {/* Alerts */}
      {pendingTeachers.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm">
              You have {pendingTeachers.length} teacher approval{pendingTeachers.length > 1 ? 's' : ''} pending review
            </p>
            <Button variant="outline" size="sm" className="ml-auto">
              Review Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Teacher Approvals */}
      {pendingTeachers.length > 0 && (
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
              {mockPayments.slice(0, 5).map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>{payment.className}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
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