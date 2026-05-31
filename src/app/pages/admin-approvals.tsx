import { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Search, AlertCircle } from 'lucide-react';
import { StatCard } from '@/app/components/stat-card';
import { TeacherApprovalDialog } from '@/app/components/teacher-approval-dialog';
import { TeacherApproval } from '@/app/lib/teacher-approvals';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { EmptyState } from '@/app/components/empty-state';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function AdminApprovalsPage() {
  const [teachers, setTeachers] = useState<TeacherApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherApproval | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  const approvedTeachers = teachers.filter(t => t.status === 'active');
  const rejectedTeachers = teachers.filter(t => t.status === 'inactive');

  const filteredPendingTeachers = useMemo(() => {
    return pendingTeachers.filter(teacher => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;

      return (
        teacher.name.toLowerCase().includes(term) ||
        teacher.subject.toLowerCase().includes(term) ||
        teacher.qualification.toLowerCase().includes(term)
      );
    });
  }, [pendingTeachers, searchTerm]);

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
        setTeachers(prev =>
          prev.map(t => (t.id === teacherId ? { ...t, ...updatedTeacher } : t))
        );
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
        <h1 className="text-3xl mb-2">Teacher Approvals</h1>
        <p className="text-muted-foreground">Review and approve teacher registrations</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Reviews"
          value={pendingTeachers.length}
          icon={AlertCircle}
          description="Awaiting approval"
          color="orange"
        />
        <StatCard
          title="Approved Teachers"
          value={approvedTeachers.length}
          icon={UserCheck}
          description="Active on platform"
          color="green"
        />
        <StatCard
          title="Rejected Requests"
          value={rejectedTeachers.length}
          icon={UserX}
          description="Inactive applications"
          color="pink"
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={Users}
          description="All registrations"
          color="blue"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Pending Approval Queue</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, subject, or qualification"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner label="Loading approvals" className="py-6" />
          ) : filteredPendingTeachers.length === 0 ? (
            <EmptyState message="No pending approvals match your search" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.experience} years</TableCell>
                    <TableCell>{teacher.joinedDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
          )}
        </CardContent>
      </Card>

      <TeacherApprovalDialog
        teacher={selectedTeacher}
        action={approvalAction}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmApproval}
      />
    </div>
  );
}
