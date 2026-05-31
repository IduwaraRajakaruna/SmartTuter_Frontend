import { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Search, GraduationCap } from 'lucide-react';
import { StatCard } from '@/app/components/stat-card';
import { User } from '@/app/lib/mock-data';
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
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function AdminUsersPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setStudents(response.data?.students || []);
      setTeachers(response.data?.teachers || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const activeStudents = students.filter(s => s.status === 'active');
  const activeTeachers = teachers.filter(t => t.status === 'active');
  const inactiveUsers = [...students, ...teachers].filter(u => u.status === 'inactive');

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;

    return students.filter(student =>
      [student.name, student.email].some(field => field.toLowerCase().includes(term))
    );
  }, [students, searchTerm]);

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return teachers;

    return teachers.filter(teacher =>
      [teacher.name, teacher.email, teacher.subject].some(field =>
        field.toLowerCase().includes(term)
      )
    );
  }, [teachers, searchTerm]);

  const toggleUserStatus = async (user: User, role: 'student' | 'teacher') => {
    const updatedStatus = user.status === 'active' ? 'inactive' : 'active';

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/users/${user.id}/status`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const updatedUser = response.data?.user;
      if (role === 'student') {
        setStudents(prev => prev.map(s => (s.id === user.id ? { ...s, ...updatedUser } : s)));
      } else {
        setTeachers(prev => prev.map(t => (t.id === user.id ? { ...t, ...updatedUser } : t)));
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to update user status.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage students and teachers on the platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={students.length + teachers.length}
          icon={Users}
          description="All accounts"
          color="blue"
        />
        <StatCard
          title="Active Students"
          value={activeStudents.length}
          icon={UserCheck}
          description="Currently learning"
          color="green"
        />
        <StatCard
          title="Active Teachers"
          value={activeTeachers.length}
          icon={GraduationCap}
          description="Approved tutors"
          color="purple"
        />
        <StatCard
          title="Inactive Users"
          value={inactiveUsers.length}
          icon={UserX}
          description="Disabled accounts"
          color="orange"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner label="Loading students" className="py-6" />
            ) : filteredStudents.length === 0 ? (
              <EmptyState message="No students found" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.joinedDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            student.status === 'active'
                              ? 'bg-green-500/10 text-green-700 border-green-200'
                              : 'bg-gray-500/10 text-gray-700 border-gray-200'
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={student.status === 'active' ? 'outline' : 'default'}
                          onClick={() => toggleUserStatus(student, 'student')}
                        >
                          {student.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner label="Loading teachers" className="py-6" />
            ) : filteredTeachers.length === 0 ? (
              <EmptyState message="No teachers found" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            teacher.status === 'active'
                              ? 'bg-green-500/10 text-green-700 border-green-200'
                              : teacher.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
                              : 'bg-gray-500/10 text-gray-700 border-gray-200'
                          }
                        >
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={teacher.status === 'active' ? 'outline' : 'default'}
                          onClick={() => toggleUserStatus(teacher, 'teacher')}
                        >
                          {teacher.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
