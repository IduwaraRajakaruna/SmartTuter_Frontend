import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { BookOpen, Calendar, Star, Users } from 'lucide-react';

interface TeacherProfileSummaryProps {
  activeClasses: number;
  upcomingClasses: number;
  totalStudents: number;
  averageRating: string;
}

export function TeacherProfileSummary({
  activeClasses,
  upcomingClasses,
  totalStudents,
  averageRating,
}: TeacherProfileSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            Active classes
          </div>
          <span className="font-semibold text-lg">{activeClasses}</span>
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
            <Users className="w-4 h-4" />
            Total students
          </div>
          <span className="font-semibold text-lg">{totalStudents}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4" />
            Average rating
          </div>
          <span className="font-semibold text-lg">{averageRating}</span>
        </div>
      </CardContent>
    </Card>
  );
}
