import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Star, BookOpen } from 'lucide-react';

type TeacherCardTeacher = {
  id: string;
  name: string;
  subject: string;
  qualification?: string;
  experience?: number;
  bio?: string;
  status?: string;
  rating?: number;
  totalReviews?: number;
};

interface TeacherCardProps {
  teacher: TeacherCardTeacher;
  onViewProfile?: (teacherId: string) => void;
  showActions?: boolean;
}

export function TeacherCard({ teacher, onViewProfile, showActions = true }: TeacherCardProps) {
  const initials = teacher.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{teacher.name}</CardTitle>
            <CardDescription className="mt-1">
              {teacher.qualification || 'Qualified educator'}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{teacher.subject}</Badge>
              {teacher.status === 'pending' && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                  Pending Approval
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{teacher.bio}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{teacher.rating ?? 0}</span>
            <span className="text-muted-foreground">({teacher.totalReviews ?? 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span>{teacher.experience ?? 0} years</span>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewProfile?.(teacher.id)}
          >
            View Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
