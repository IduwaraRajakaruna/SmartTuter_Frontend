import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentClassesFilters } from '@/app/components/student-classes/student-classes-filters';
import { StudentClassesList } from '@/app/components/student-classes/student-classes-list';
import { StudentClassesStats } from '@/app/components/student-classes/student-classes-stats';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockPayments } from '@/app/lib/mock-data';
import { toast } from 'sonner';

const statusFilters = ['all', 'active', 'upcoming', 'completed'] as const;

export function StudentClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentId = user?.id ?? 's1';
  const enrolledClassIds = useMemo(() => {
    const ids = mockPayments
      .filter(payment => payment.studentId === studentId)
      .map(payment => payment.classId);

    return ids.length > 0 ? Array.from(new Set(ids)) : ['c1', 'c2'];
  }, [studentId]);

  const enrolledClasses = useMemo(() => {
    return mockClasses.filter(classData => enrolledClassIds.includes(classData.id));
  }, [enrolledClassIds]);

  const subjects = useMemo(() => {
    return ['all', ...new Set(enrolledClasses.map(classData => classData.subject))];
  }, [enrolledClasses]);

  const filteredClasses = enrolledClasses.filter(classData => {
    const matchesSearch = classData.title.toLowerCase().includes(searchTerm.toLowerCase())
      || classData.subject.toLowerCase().includes(searchTerm.toLowerCase())
      || classData.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || classData.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || classData.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getPaymentStatus = (classId: string) => {
    const payment = mockPayments.find(p => p.studentId === studentId && p.classId === classId);
    return payment?.status ?? 'pending';
  };

  const handleJoinClass = (classId: string) => {
    const classData = enrolledClasses.find(c => c.id === classId);
    if (!classData?.zoomLink) {
      toast.error('No meeting link available yet');
      return;
    }
    window.open(classData.zoomLink, '_blank');
    toast.success('Opening your class session...');
  };

  const handleViewMaterials = (classId: string) => {
    navigate('/student/materials');
    toast.info('Showing materials for your classes');
  };

  const handleViewPayments = (classId: string) => {
    navigate('/student/payments');
  };

  const stats = {
    total: enrolledClasses.length,
    active: enrolledClasses.filter(c => c.status === 'active').length,
    upcoming: enrolledClasses.filter(c => c.status === 'upcoming').length,
    pendingPayments: enrolledClasses.filter(c => getPaymentStatus(c.id) === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Classes</h1>
        <p className="text-muted-foreground">Manage your enrolled classes and learning schedule</p>
      </div>

      <StudentClassesStats
        total={stats.total}
        active={stats.active}
        upcoming={stats.upcoming}
        pendingPayments={stats.pendingPayments}
      />

      <StudentClassesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        subjectFilter={subjectFilter}
        onSubjectChange={setSubjectFilter}
        statusFilter={statusFilter}
        onStatusChange={(value) => setStatusFilter(value as any)}
        subjects={subjects}
        statuses={Array.from(statusFilters)}
      />

      <StudentClassesList
        classes={filteredClasses}
        getPaymentStatus={getPaymentStatus}
        onJoinClass={handleJoinClass}
        onViewMaterials={handleViewMaterials}
        onViewPayments={handleViewPayments}
      />
    </div>
  );
}
