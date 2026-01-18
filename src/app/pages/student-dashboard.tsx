import { StatCard } from '@/app/components/stat-card';
import { ClassCard } from '@/app/components/class-card';
import { BookOpen, Calendar, CreditCard, Star } from 'lucide-react';
import { mockClasses, mockPayments } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export function StudentDashboard() {
  // Mock student's enrolled classes
  const enrolledClasses = mockClasses.filter((_, i) => i < 2);
  const upcomingClass = enrolledClasses[0];
  const completedPayments = mockPayments.filter(p => p.status === 'completed');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome Back, Student!</h1>
        <p className="text-muted-foreground">Here's your learning overview</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Classes"
          value={enrolledClasses.length}
          icon={BookOpen}
          description="Active courses"
          color="blue"
        />
        <StatCard
          title="Upcoming Classes"
          value={1}
          icon={Calendar}
          description="This week"
          color="purple"
        />
        <StatCard
          title="Payment Status"
          value="Paid"
          icon={CreditCard}
          description="All dues cleared"
          color="green"
        />
        <StatCard
          title="Reviews Given"
          value={3}
          icon={Star}
          description="Thank you!"
          color="orange"
        />
      </div>

      {/* Next Class */}
      {upcomingClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Next Class</CardTitle>
              <Badge className="bg-green-500/10 text-green-700 border-green-200">Today</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-1">{upcomingClass.title}</h3>
                <p className="text-sm text-muted-foreground">with {upcomingClass.teacherName}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{upcomingClass.schedule.split(' - ')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Time: 6:00 PM - 7:30 PM</span>
                </div>
              </div>
              <a
                href={upcomingClass.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Join Zoom Class
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrolled Classes */}
      <div>
        <h2 className="text-2xl mb-4">My Classes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledClasses.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              showActions={false}
            />
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedPayments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{payment.className}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{payment.amount}</p>
                  <Badge className="bg-green-500/10 text-green-700 border-green-200">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}