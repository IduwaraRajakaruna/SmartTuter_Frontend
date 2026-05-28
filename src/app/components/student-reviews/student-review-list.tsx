import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { EmptyState } from '@/app/components/empty-state';
import { Star } from 'lucide-react';

interface StudentReviewListItem {
  id: string;
  teacherName: string;
  rating: number;
  comment: string;
  date: string;
}

interface StudentReviewListProps {
  reviews: StudentReviewListItem[];
}

export function StudentReviewList({ reviews }: StudentReviewListProps) {
  if (reviews.length === 0) {
    return <EmptyState message="You have not submitted any reviews yet." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{review.teacherName}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{review.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
