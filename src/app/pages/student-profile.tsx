import { useState } from 'react';
import { StudentProfileForm } from '@/app/components/student-profile/student-profile-form';
import { StudentProfileHeader } from '@/app/components/student-profile/student-profile-header';
import { StudentProfileSummary } from '@/app/components/student-profile/student-profile-summary';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockPayments } from '@/app/lib/mock-data';
import { toast } from 'sonner';

export function StudentProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const studentId = user?.id ?? 's1';

  const enrolledClasses = mockPayments.filter(payment => payment.studentId === studentId)
    .map(payment => payment.classId);
  const uniqueClasses = Array.from(new Set(enrolledClasses));
  const upcomingClasses = mockClasses.filter(
    classData => uniqueClasses.includes(classData.id) && classData.status === 'upcoming',
  ).length;
  const pendingPayments = mockPayments.filter(
    payment => payment.studentId === studentId && payment.status === 'pending',
  ).length;

  const handleSave = (payload: { name: string; phone: string }) => {
    setPhone(payload.phone);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and learning summary.</p>
      </div>

      <StudentProfileHeader
        name={user?.name ?? 'Student'}
        email={user?.email ?? 'student@tuition.com'}
        status={user?.status}
        joinedDate={user?.joinedDate}
      />

      <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <StudentProfileForm
            name={user?.name ?? 'Student'}
            email={user?.email ?? 'student@tuition.com'}
            phone={phone}
            onSave={handleSave}
          />
          <StudentThemeToggle />
        </div>
        <div className="space-y-6">
          <StudentProfileSummary
            enrolledClasses={uniqueClasses.length}
            upcomingClasses={upcomingClasses}
            pendingPayments={pendingPayments}
          />
        </div>
      </div>
    </div>
  );
}
