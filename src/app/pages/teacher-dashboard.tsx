import { StatCard } from '@/app/components/stat-card';
import { TeacherClassCard } from '@/app/components/teacher-class-card';
import { ReviewItem } from '@/app/components/review-item';
import { BookOpen, Users, Star, FileText } from 'lucide-react';
import { mockClasses, mockReviews } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export function TeacherDashboard() {
  // Mock teacher's classes (first 2 classes for this teacher)
  const teacherClasses = mockClasses.filter(c => c.teacherId === 't1');
  const teacherReviews = mockReviews.filter(r => r.teacherId === 't1');
  const avgRating = (teacherReviews.reduce((sum, r) => sum + r.rating, 0) / teacherReviews.length).toFixed(1);
  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.studentsEnrolled, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome Back, Dr. Johnson!</h1>
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

      {/* My Classes */}
      <div>
        <h2 className="text-2xl mb-4">My Classes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {teacherClasses.map((classData) => (
            <TeacherClassCard 
              key={classData.id} 
              classData={classData}
              onEdit={() => {}}
              onStartSession={() => {}}
            />
          ))}
        </div>
      </div>

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