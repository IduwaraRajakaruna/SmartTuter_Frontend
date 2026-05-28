import { Class } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface TeacherClassCardProps {
  classData: Class;
  onEdit?: (classId: string) => void;
  onStartSession?: (classId: string) => void;
}

export function TeacherClassCard({ classData, onEdit, onStartSession }: TeacherClassCardProps) {
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
            <p className="text-sm text-muted-foreground mt-1">{classData.subject}</p>
          </div>
          <Badge className={getStatusColor(classData.status)}>
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit?.(classData.id)}
            >
              Edit Class
            </Button>
            <Button
              variant="cta"
              className="flex-1"
              onClick={() => onStartSession?.(classData.id)}
            >
              Start Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
