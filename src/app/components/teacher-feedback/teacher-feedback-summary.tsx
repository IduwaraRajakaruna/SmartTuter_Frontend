import { StatCard } from '@/app/components/stat-card';
import { MessageCircle, Star, Users } from 'lucide-react';

interface TeacherFeedbackSummaryProps {
  averageRating: string;
  totalReviews: number;
  totalStudents: number;
}

export function TeacherFeedbackSummary({
  averageRating,
  totalReviews,
  totalStudents,
}: TeacherFeedbackSummaryProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Average Rating"
        value={averageRating}
        icon={Star}
        description="Overall score"
        color="orange"
      />
      <StatCard
        title="Total Reviews"
        value={totalReviews}
        icon={MessageCircle}
        description="Student feedback"
        color="blue"
      />
      <StatCard
        title="Total Students"
        value={totalStudents}
        icon={Users}
        description="Across classes"
        color="purple"
      />
    </div>
  );
}
