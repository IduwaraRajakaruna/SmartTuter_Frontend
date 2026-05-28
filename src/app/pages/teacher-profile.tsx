import { useState } from 'react';
import { TeacherProfileForm } from '@/app/components/teacher-profile/teacher-profile-form';
import { TeacherProfileHeader } from '@/app/components/teacher-profile/teacher-profile-header';
import { TeacherProfileSummary } from '@/app/components/teacher-profile/teacher-profile-summary';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockReviews, mockTeachers } from '@/app/lib/mock-data';
import { toast } from 'sonner';

export function TeacherProfilePage() {
  const { user } = useAuth();
  const teacherId = user?.id ?? 't1';
  const teacher = mockTeachers.find(t => t.id === teacherId) ?? mockTeachers[0];
  const [formState, setFormState] = useState({
    name: teacher?.name ?? 'Teacher',
    subject: teacher?.subject ?? 'Subject',
    qualification: teacher?.qualification ?? 'Qualification',
    experience: teacher?.experience ?? 0,
    bio: teacher?.bio ?? '',
    hourlyRate: '800',
    zoomLink: 'https://zoom.us/j/1234567890',
  });

  const teacherClasses = mockClasses.filter(classData => classData.teacherId === teacherId);
  const activeClasses = teacherClasses.filter(classData => classData.status === 'active').length;
  const upcomingClasses = teacherClasses.filter(classData => classData.status === 'upcoming').length;
  const totalStudents = teacherClasses.reduce((sum, classData) => sum + classData.studentsEnrolled, 0);
  const teacherReviews = mockReviews.filter(review => review.teacherId === teacherId);
  const averageRating = teacherReviews.length > 0
    ? (teacherReviews.reduce((sum, review) => sum + review.rating, 0) / teacherReviews.length).toFixed(1)
    : '0.0';

  const handleSave = (payload: {
    name: string;
    subject: string;
    qualification: string;
    experience: number;
    bio: string;
    hourlyRate: string;
    zoomLink: string;
  }) => {
    setFormState(payload);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Teacher Profile</h1>
        <p className="text-muted-foreground">Manage your professional profile and public information</p>
      </div>

      <TeacherProfileHeader
        name={formState.name}
        email={user?.email ?? teacher?.email ?? 'teacher@tuition.com'}
        subject={formState.subject}
        qualification={formState.qualification}
        status={teacher?.status}
      />

      <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
        <TeacherProfileForm
          name={formState.name}
          email={user?.email ?? teacher?.email ?? 'teacher@tuition.com'}
          subject={formState.subject}
          qualification={formState.qualification}
          experience={formState.experience}
          bio={formState.bio}
          hourlyRate={formState.hourlyRate}
          zoomLink={formState.zoomLink}
          onSave={handleSave}
        />
        <div className="space-y-6">
          <TeacherProfileSummary
            activeClasses={activeClasses}
            upcomingClasses={upcomingClasses}
            totalStudents={totalStudents}
            averageRating={averageRating}
          />
          <StudentThemeToggle />
        </div>
      </div>
    </div>
  );
}
