import { useEffect, useState } from 'react';
import { StatCard } from '@/app/components/stat-card';
import { PaymentListItem } from '@/app/components/payment-list-item';
import { BookOpen, Calendar, CreditCard, Star } from 'lucide-react';
import { mockClasses } from '@/app/lib/mock-data';
import { getStoredClasses } from '@/app/lib/classes-storage';
import { seedPayments, getStoredPayments } from '@/app/lib/payments-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/auth-context';
import { listMyReviews } from '@/services/reviewsService';
import type { Class, Payment } from '@/app/lib/mock-data';

export function StudentDashboard() {
  const { user } = useAuth();
  const studentId = user?.id ?? 's1';
  const [reviewsGiven, setReviewsGiven] = useState(0);
  const availableClasses = getStoredClasses();
  const classCatalog = availableClasses.length > 0 ? availableClasses : mockClasses;

  seedPayments();
  const allPayments: Payment[] = getStoredPayments();
  const enrolledClassIds = allPayments
    .filter((payment: Payment) => payment.studentId === studentId && payment.status === 'completed')
    .map((payment: Payment) => payment.classId);

  const enrolledClasses = classCatalog.filter((classData: Class) => enrolledClassIds.includes(classData.id));

  // find the next upcoming/active class by startDate
  const upcomingCandidates = enrolledClasses.filter((classData: Class) => classData.status === 'upcoming' || classData.status === 'active');
  const upcomingClass = upcomingCandidates.sort((a: Class, b: Class) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const completedPayments = allPayments.filter((payment: Payment) => payment.studentId === studentId && payment.status === 'completed');
  const upcomingClassCount = upcomingClass ? 1 : 0;
  const paymentSummary = completedPayments.length > 0 ? 'Paid' : 'No payments yet';

  useEffect(() => {
    const loadReviewCount = async () => {
      try {
        const response = await listMyReviews();
        setReviewsGiven(response.summary.totalReviews || response.reviews.length);
      } catch (error) {
        console.error(error);
      }
    };

    loadReviewCount();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome Back, {user?.name ?? 'Student'}!</h1>
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
          value={upcomingClassCount}
          icon={Calendar}
          description="This week"
          color="purple"
        />
        <StatCard
          title="Payment Status"
          value={paymentSummary}
          icon={CreditCard}
          description={completedPayments.length > 0 ? 'All dues cleared' : 'No completed payments yet'}
          color="green"
        />
        <StatCard
          title="Reviews Given"
          value={reviewsGiven}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2D8CFF] text-white hover:bg-[#1D78E6]"
              >
                Join Zoom Class
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Removed My Classes section — classes are available on My Classes page */}

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedPayments.length > 0 ? (
              completedPayments.slice(0, 3).map((payment: Payment) => (
                <PaymentListItem key={payment.id} payment={payment} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No payments yet for this student.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}