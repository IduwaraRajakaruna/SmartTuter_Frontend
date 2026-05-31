import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PublicNav } from '@/app/components/public-nav';
import { TeacherProfileHeader } from '@/app/components/teacher-profile/teacher-profile-header';
import { TeacherProfileSummary } from '@/app/components/teacher-profile/teacher-profile-summary';
import { StudentThemeToggle } from '@/app/components/student-profile/student-theme-toggle';
import { Card, CardContent } from '@/app/components/ui/card';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { Badge } from '@/app/components/ui/badge';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

type TeacherPublic = {
  id: string;
  name: string;
  email?: string;
  subject?: string;
  qualification?: string;
  experience?: number;
  phone?: string;
  bio?: string;
  hourlyRate?: number;
  zoomLink?: string;
  status?: string;
};

export function TeacherPublicProfilePage() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState<TeacherPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        if (!teacherId) return;
        const res = await axios.get(`${API_BASE_URL}/api/teachers/${teacherId}`);
        setTeacher(res.data?.teacher ?? null);
      } catch (e) {
        console.error(e);
        setTeacher(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [teacherId]);

  const summary = useMemo(() => {
    // Backend currently returns only profile fields. Keep UI stable.
    return {
      activeClasses: 0,
      upcomingClasses: 0,
      totalStudents: 0,
      averageRating: '0.0',
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="container mx-auto px-6 py-10 space-y-6">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner label="Loading teacher profile" />
          </div>
        ) : !teacher ? (
          <Card>
            <CardContent className="p-6">Teacher not found.</CardContent>
          </Card>
        ) : (
          <>
            <TeacherProfileHeader
              name={teacher.name}
              email={teacher.email || ''}
              subject={teacher.subject}
              qualification={teacher.qualification}
              status={teacher.status as any}
            />

            <div className="grid xl:grid-cols-[2fr_1fr] gap-6 items-start">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {teacher.subject && <Badge variant="secondary">{teacher.subject}</Badge>}
                      {teacher.experience !== undefined && (
                        <Badge variant="outline">{teacher.experience} years experience</Badge>
                      )}
                      {teacher.hourlyRate !== undefined && teacher.hourlyRate !== null && (
                        <Badge variant="outline">₹{teacher.hourlyRate}/hr</Badge>
                      )}
                    </div>

                    {teacher.bio && <p className="text-sm text-muted-foreground">{teacher.bio}</p>}

                    {teacher.zoomLink && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Zoom link</p>
                        <a
                          className="text-primary underline break-all"
                          href={teacher.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {teacher.zoomLink}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <TeacherProfileSummary
                  activeClasses={summary.activeClasses}
                  upcomingClasses={summary.upcomingClasses}
                  totalStudents={summary.totalStudents}
                  averageRating={summary.averageRating}
                />
                <StudentThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

