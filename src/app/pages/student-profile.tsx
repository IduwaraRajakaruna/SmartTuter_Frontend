import { useEffect, useState } from 'react';
import { StudentProfileForm } from '@/app/components/student-profile/student-profile-form';
import { StudentProfileHeader } from '@/app/components/student-profile/student-profile-header';
import { StudentProfileSummary } from '@/app/components/student-profile/student-profile-summary';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockPayments } from '@/app/lib/mock-data';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function StudentProfilePage() {
  const { user, logout, setSession } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name ?? 'Student',
    email: user?.email ?? 'student@tuition.com',
    phone: user?.phone ?? '',
    status: user?.status,
    joinedDate: user?.joinedDate,
  });
  const [isLoading, setIsLoading] = useState(true);
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
          const updatedProfile = {
            name: responseUser.fullName || responseUser.name || profile.name,
            email: responseUser.email || profile.email,
            phone: responseUser.phone || '',
            status: responseUser.status,
            joinedDate: responseUser.joinedDate || profile.joinedDate,
          };
          setProfile(updatedProfile);
          setSession({
            ...(user ?? { id: responseUser.id, role: responseUser.role }),
            id: responseUser.id,
            name: updatedProfile.name,
            email: updatedProfile.email,
            role: responseUser.role || user?.role || 'student',
            status: responseUser.status || user?.status || 'active',
            joinedDate: updatedProfile.joinedDate || new Date().toISOString(),
            phone: responseUser.phone || '',
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

  const handleSave = async (payload: { name: string; phone: string }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/me`,
        {
          fullName: payload.name,
          phone: payload.phone,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const responseUser = response.data?.user;
      if (responseUser) {
        const updatedProfile = {
          name: responseUser.fullName || payload.name,
          email: responseUser.email || profile.email,
          phone: responseUser.phone || payload.phone,
          status: responseUser.status,
          joinedDate: responseUser.joinedDate || profile.joinedDate,
        };
        setProfile(updatedProfile);
        setSession({
          ...(user ?? { id: responseUser.id, role: responseUser.role }),
          id: responseUser.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          role: responseUser.role || user?.role || 'student',
          status: responseUser.status || user?.status || 'active',
          joinedDate: updatedProfile.joinedDate || new Date().toISOString(),
          phone: responseUser.phone || payload.phone,
        });
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
        <h1 className="text-3xl mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and learning summary.</p>
      </div>

      <StudentProfileHeader
        name={profile.name}
        email={profile.email}
        status={profile.status}
        joinedDate={profile.joinedDate}
      />

      <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <StudentProfileForm
            name={profile.name}
            email={profile.email}
            phone={profile.phone}
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
    </div>
  );
}
