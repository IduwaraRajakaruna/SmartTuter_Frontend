import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { BookOpen, Calendar, CreditCard } from 'lucide-react';

interface StudentProfileSummaryProps {
  enrolledClasses: number;
  upcomingClasses: number;
  pendingPayments: number;
}

export function StudentProfileSummary({
  enrolledClasses,
  upcomingClasses,
  pendingPayments,
}: StudentProfileSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            Enrolled classes
          </div>
          <span className="font-semibold text-lg">{enrolledClasses}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Upcoming classes
          </div>
          <span className="font-semibold text-lg">{upcomingClasses}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            Pending payments
          </div>
          <span className="font-semibold text-lg">{pendingPayments}</span>
        </div>
      </CardContent>
    </Card>
  );
}
