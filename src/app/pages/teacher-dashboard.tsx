import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/app/components/stat-card';
import { TeacherClassCard } from '@/app/components/teacher-class-card';
import { ReviewItem } from '@/app/components/review-item';
import { BookOpen, Users, Star, FileText } from 'lucide-react';
import { mockReviews } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useAuth } from '@/app/context/auth-context';
import { getTeacherClasses } from '@/app/lib/classes-storage';

export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacherClasses, setTeacherClasses] = useState(() => getTeacherClasses(user?.id));
  const teacherReviews = mockReviews.filter(r => r.teacherId === 't1');
  const avgRating = (teacherReviews.reduce((sum, r) => sum + r.rating, 0) / teacherReviews.length).toFixed(1);
  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.studentsEnrolled, 0);

  useEffect(() => {
    setTeacherClasses(getTeacherClasses(user?.id));
  }, [user?.id]);

  const nextClass = useMemo(() => {
    if (teacherClasses.length === 0) return undefined;
    const sorted = [...teacherClasses].sort((a, b) => {
      const aTime = new Date(a.startDate).getTime();
      const bTime = new Date(b.startDate).getTime();
      return aTime - bTime;
    });
    return sorted[0];
  }, [teacherClasses]);

  const handleEditClass = (classId: string) => {
    navigate(`/teacher/classes/create?edit=${classId}`);
  };

  const handleStartSession = (classId: string) => {
    const classData = teacherClasses.find(c => c.id === classId);
    if (classData?.zoomLink) {
      window.open(classData.zoomLink, '_blank');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome Back, {user?.name ?? 'Teacher'}!</h1>
        <p className="text-muted-foreground">Here's your teaching overview</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Classes"
          value={teacherClasses.length}
          icon={BookOpen}
          description="Currently teaching"
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          description="Across all classes"
          color="purple"
        />
        <StatCard
          title="Average Rating"
          value={avgRating}
          icon={Star}
          description={`${teacherReviews.length} reviews`}
          color="orange"
        />
        <StatCard
          title="Study Materials"
          value={8}
          icon={FileText}
          description="Resources uploaded"
          color="cyan"
        />
      </div>

      {/* Next Class */}
      {nextClass && (
        <div>
          <h2 className="text-2xl mb-4">Next Class</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TeacherClassCard
              key={nextClass.id}
              classData={nextClass}
              onEdit={handleEditClass}
              onStartSession={handleStartSession}
            />
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Student Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}