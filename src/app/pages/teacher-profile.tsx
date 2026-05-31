import { useEffect, useState } from 'react';
import { TeacherProfileForm } from '@/app/components/teacher-profile/teacher-profile-form';
import { TeacherProfileHeader } from '@/app/components/teacher-profile/teacher-profile-header';
import { TeacherProfileSummary } from '@/app/components/teacher-profile/teacher-profile-summary';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockReviews, mockTeachers } from '@/app/lib/mock-data';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function TeacherProfilePage() {
  const { user, logout, setSession } = useAuth();
  const teacherId = user?.id ?? 't1';
  const teacher = mockTeachers.find(t => t.id === teacherId) ?? mockTeachers[0];
  const [formState, setFormState] = useState({
    name: user?.name ?? teacher?.name ?? 'Teacher',
    subject: user?.subject ?? teacher?.subject ?? 'Subject',
    qualification: user?.qualification ?? teacher?.qualification ?? 'Qualification',
    experience: user?.experience ?? teacher?.experience ?? 0,
    bio: user?.bio ?? teacher?.bio ?? '',
    hourlyRate: user?.hourlyRate ? String(user.hourlyRate) : '800',
    zoomLink: user?.zoomLink ?? 'https://zoom.us/j/1234567890',
  });
  const [profileStatus, setProfileStatus] = useState(user?.status ?? teacher?.status);
  const [isLoading, setIsLoading] = useState(true);

  const teacherClasses = mockClasses.filter(classData => classData.teacherId === teacherId);
  const activeClasses = teacherClasses.filter(classData => classData.status === 'active').length;
  const upcomingClasses = teacherClasses.filter(classData => classData.status === 'upcoming').length;
  const totalStudents = teacherClasses.reduce((sum, classData) => sum + classData.studentsEnrolled, 0);
  const teacherReviews = mockReviews.filter(review => review.teacherId === teacherId);
  const averageRating = teacherReviews.length > 0
    ? (teacherReviews.reduce((sum, review) => sum + review.rating, 0) / teacherReviews.length).toFixed(1)
    : '0.0';

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        const responseUser = response.data?.user;
        if (responseUser) {
          const updatedState = {
            name: responseUser.fullName || formState.name,
            subject: responseUser.subject || formState.subject,
            qualification: responseUser.qualification || formState.qualification,
            experience: responseUser.experience ?? formState.experience,
            bio: responseUser.bio || '',
            hourlyRate: responseUser.hourlyRate !== undefined && responseUser.hourlyRate !== null
              ? String(responseUser.hourlyRate)
              : formState.hourlyRate,
            zoomLink: responseUser.zoomLink || formState.zoomLink,
          };
          setFormState(updatedState);
          setProfileStatus(responseUser.status || profileStatus);
          setSession({
            ...(user ?? { id: responseUser.id, role: responseUser.role }),
            id: responseUser.id,
            name: updatedState.name,
            email: responseUser.email || user?.email || '',
            role: responseUser.role || user?.role || 'teacher',
            status: responseUser.status || user?.status || 'active',
            joinedDate: responseUser.joinedDate || user?.joinedDate || new Date().toISOString(),
            subject: responseUser.subject,
            qualification: responseUser.qualification,
            experience: responseUser.experience,
            bio: responseUser.bio,
            hourlyRate: responseUser.hourlyRate,
            zoomLink: responseUser.zoomLink,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (payload: {
    name: string;
    subject: string;
    qualification: string;
    experience: number;
    bio: string;
    hourlyRate: string;
    zoomLink: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/me`,
        {
          fullName: payload.name,
          subject: payload.subject,
          qualification: payload.qualification,
          experience: payload.experience,
          bio: payload.bio,
          hourlyRate: payload.hourlyRate,
          zoomLink: payload.zoomLink,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const responseUser = response.data?.user;
      if (responseUser) {
        const updatedState = {
          name: responseUser.fullName || payload.name,
          subject: responseUser.subject || payload.subject,
          qualification: responseUser.qualification || payload.qualification,
          experience: responseUser.experience ?? payload.experience,
          bio: responseUser.bio || payload.bio,
          hourlyRate: responseUser.hourlyRate !== undefined && responseUser.hourlyRate !== null
            ? String(responseUser.hourlyRate)
            : payload.hourlyRate,
          zoomLink: responseUser.zoomLink || payload.zoomLink,
        };
        setFormState(updatedState);
        setProfileStatus(responseUser.status || profileStatus);
        setSession({
          ...(user ?? { id: responseUser.id, role: responseUser.role }),
          id: responseUser.id,
          name: updatedState.name,
          email: responseUser.email || user?.email || '',
          role: responseUser.role || user?.role || 'teacher',
          status: responseUser.status || user?.status || 'active',
          joinedDate: responseUser.joinedDate || user?.joinedDate || new Date().toISOString(),
          subject: responseUser.subject,
          qualification: responseUser.qualification,
          experience: responseUser.experience,
          bio: responseUser.bio,
          hourlyRate: responseUser.hourlyRate,
          zoomLink: responseUser.zoomLink,
        });
      } else {
        setFormState(payload);
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error(error);
      const serverMessage = error?.response?.data?.message;
      toast.error(serverMessage || 'Unable to update profile.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Teacher Profile</h1>
        <p className="text-muted-foreground">Manage your professional profile and public information</p>
      </div>

      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner label="Loading profile" />
        </div>
      ) : (
        <>

          <TeacherProfileHeader
            name={formState.name}
            email={user?.email ?? teacher?.email ?? 'teacher@tuition.com'}
            subject={formState.subject}
            qualification={formState.qualification}
            status={profileStatus}
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
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sign out</p>
                    <p className="text-sm text-muted-foreground">End your current session.</p>
                  </div>
                  <Button
                    variant="outline"
                    className="dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
