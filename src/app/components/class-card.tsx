import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Class } from '@/app/lib/mock-data';
import { Calendar, Users, DollarSign } from 'lucide-react';

interface ClassCardProps {
  classData: Class;
  onEnroll?: (classId: string) => void;
  onViewDetails?: (classId: string) => void;
  showActions?: boolean;
}

export function ClassCard({ classData, onEnroll, onViewDetails, showActions = true }: ClassCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
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
          <Badge className={getStatusColor(classData.status)}>
            {classData.status}
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
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{classData.studentsEnrolled} / {classData.maxStudents} students</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-semibold">{classData.price}</span>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails?.(classData.id)}
          >
            View Details
          </Button>
          <Button
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
