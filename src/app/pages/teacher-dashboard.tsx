import { StatCard } from '@/app/components/stat-card';
import { BookOpen, Users, Star, FileText } from 'lucide-react';
import { mockClasses, mockReviews } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

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
            <Card key={classData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{classData.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{classData.subject}</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 border-green-200">
                    {classData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students Enrolled</span>
                    <span className="font-medium">
                      {classData.studentsEnrolled} / {classData.maxStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="text-right">{classData.schedule}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-4 py-2 border rounded-md text-sm hover:bg-accent">
                      Edit Class
                    </button>
                    <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                      Start Session
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            {teacherReviews.map((review) => {
              const initials = review.studentName.split(' ').map(n => n[0]).join('');
              return (
                <div key={review.id} className="flex gap-4 py-3 border-b last:border-0">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{review.studentName}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}