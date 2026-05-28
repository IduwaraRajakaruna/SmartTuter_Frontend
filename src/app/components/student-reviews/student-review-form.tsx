import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Star } from 'lucide-react';

interface TeacherOption {
  id: string;
  name: string;
}

interface StudentReviewFormProps {
  teacherOptions: TeacherOption[];
  onSubmit: (payload: { teacherId: string; rating: number; comment: string }) => void;
}

export function StudentReviewForm({ teacherOptions, onSubmit }: StudentReviewFormProps) {
  const [teacherId, setTeacherId] = useState(teacherOptions[0]?.id ?? '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!teacherId || !comment.trim()) {
      return;
    }
    onSubmit({ teacherId, rating, comment: comment.trim() });
    setComment('');
    setRating(5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Teacher</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teacherOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(value => (
                <Button
                  key={value}
                  type="button"
                  variant={value <= rating ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setRating(value)}
                >
                  <Star className={value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'} />
                </Button>
              ))}
              <span className="text-sm text-muted-foreground">{rating} / 5</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Review</Label>
            <Textarea
              placeholder="Share your learning experience"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={!teacherId || !comment.trim()}>
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
