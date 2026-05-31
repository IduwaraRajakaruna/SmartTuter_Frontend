import { Review } from '@/app/lib/mock-data';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const initials = review.studentName.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex gap-4 py-3 border-b last:border-0">
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
        {review.className && <p className="text-xs text-muted-foreground mb-1">{review.className}</p>}
        <p className="text-sm text-muted-foreground">{review.comment}</p>
        <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
      </div>
    </div>
  );
}
