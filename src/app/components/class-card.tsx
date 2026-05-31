import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Class } from '@/app/lib/mock-data';

// NOTE: using mock-data types here; card supports real classData fields at runtime.

import { Calendar, Users } from 'lucide-react';

interface ClassCardProps {
  classData: Class;
  onEnroll?: (classId: string) => void;
  onViewDetails?: (classId: string) => void;
  showActions?: boolean;
}

export function ClassCard({ classData, onEnroll, onViewDetails, showActions = true }: ClassCardProps) {
  const getComputedBatchLabel = (data: Class) => {
    const now = new Date();
    const start = data.startDate ? new Date(data.startDate) : null;
    const end = data.endDate ? new Date(data.endDate) : null;

    if (!start || !end) {
      // Fallback to classData.status if dates are missing
      if (data.status === 'active') return 'Ongoing batch';
      if (data.status === 'upcoming') return 'Upcoming batch';
      if (data.status === 'completed') return 'Completed batch';
      return 'Ongoing batch';
    }

    if (start.getTime() > now.getTime()) return 'Upcoming batch';
    if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) return 'Ongoing batch';
    return 'Completed batch';
  };

  const getComputedBatchColor = (data: Class) => {
    const label = getComputedBatchLabel(data);
    if (label === 'Upcoming batch') return 'bg-blue-500/10 text-blue-700 border-blue-200';
    if (label === 'Ongoing batch') return 'bg-green-500/10 text-green-700 border-green-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
  };


  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{classData.title}</CardTitle>
            <CardDescription className="mt-1">
              By {classData.teacherName}
            </CardDescription>
          </div>
          <Badge className={getComputedBatchColor(classData)}>
            {(() => {
              const label = getComputedBatchLabel(classData);
              if (label === 'Upcoming batch') return 'Upcoming';
              if (label === 'Ongoing batch') return 'Ongoing';
              return 'Completed';
            })()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{classData.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{classData.schedule}</span>
          </div>

          {classData.startDate && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              {(() => {
                const now = new Date();
                const start = new Date(classData.startDate);
                const label = start.getTime() > now.getTime() ? 'Upcoming batch' : 'Ongoing class';
                return <span>{label}</span>;
              })()}
            </div>
          )}


          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{classData.studentsEnrolled} / {classData.maxStudents} students</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-muted-foreground">
              Rs
            </span>
            <span className="font-semibold">{classData.price}</span>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">

          <Button
            variant="cta"
            className="flex-1"
            onClick={() => onEnroll?.(classData.id)}
            disabled={classData.studentsEnrolled >= classData.maxStudents}
          >
            {classData.studentsEnrolled >= classData.maxStudents ? 'Full' : 'Enroll'}
          </Button>
        </CardFooter>
      )}

    </Card>
  );
}
