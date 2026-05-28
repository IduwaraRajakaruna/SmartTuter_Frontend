import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { EmptyState } from '@/app/components/empty-state';
import { ReviewItem } from '@/app/components/review-item';
import { Review } from '@/app/lib/mock-data';

interface TeacherFeedbackListProps {
  reviews: Review[];
}

export function TeacherFeedbackList({ reviews }: TeacherFeedbackListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <EmptyState message="No reviews yet. Encourage students to leave feedback after classes." />
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
