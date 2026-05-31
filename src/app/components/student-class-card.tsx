import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Class } from '@/app/lib/mock-data';
import { Calendar, Clock, Video } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface StudentClassCardProps {
  classData: Class;
  paymentStatus?: 'completed' | 'pending' | 'failed';
  onJoinClass?: (classId: string) => void;
  onViewMaterials?: (classId: string) => void;
  onViewPayments?: (classId: string) => void;
}

export function StudentClassCard({
  classData,
  paymentStatus = 'completed',
  onJoinClass,
  onViewMaterials,
  onViewPayments,
}: StudentClassCardProps) {
  const statusBadge = classData.status === 'active'
    ? 'bg-green-500/10 text-green-700 border-green-200'
    : classData.status === 'upcoming'
    ? 'bg-blue-500/10 text-blue-700 border-blue-200'
    : 'bg-gray-500/10 text-gray-700 border-gray-200';

  const paymentBadge = paymentStatus === 'completed'
    ? 'bg-green-500/10 text-green-700 border-green-200'
    : paymentStatus === 'pending'
    ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
    : 'bg-red-500/10 text-red-700 border-red-200';

  const canJoin = paymentStatus === 'completed' && Boolean(classData.zoomLink);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{classData.title}</CardTitle>
            <CardDescription className="mt-1">By {classData.teacherName}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusBadge}>{classData.status}</Badge>
            <Badge className={paymentBadge}>
              {paymentStatus === 'completed' ? 'Paid' : paymentStatus === 'pending' ? 'Payment pending' : 'Payment failed'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{classData.description}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{classData.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {classData.status === 'completed'
                ? `Ended on ${classData.endDate}`
                : `Starts on ${classData.startDate}`}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {canJoin ? (
          <Button asChild variant="cta" className="gap-2 bg-[#2D8CFF] text-white hover:bg-[#1D78E6]">
            <a href={classData.zoomLink} target="_blank" rel="noreferrer">
              <Video className="w-4 h-4" />
              Join class
            </a>
          </Button>
        ) : (
          <Button
            variant="cta"
            className={cn('gap-2 bg-[#2D8CFF] text-white hover:bg-[#1D78E6]', 'opacity-60')}
            disabled
            onClick={() => onJoinClass?.(classData.id)}
          >
            <Video className="w-4 h-4" />
            Join class
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onViewMaterials?.(classData.id)}
        >
          Materials
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewPayments?.(classData.id)}
        >
          Payments
        </Button>
      </CardFooter>
    </Card>
  );
}
