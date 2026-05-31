import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { StudentReviewForm } from '@/app/components/student-reviews/student-review-form';
import { StudentReviewList } from '@/app/components/student-reviews/student-review-list';

interface TeacherOption {
  id: string;
  name: string;
  classId: string;
  className: string;
}

interface StudentReviewsTabsProps {
  teacherOptions: TeacherOption[];
  reviews: Array<{
    id: string;
    teacherName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  onSubmit: (payload: { teacherId: string; classId: string; className: string; rating: number; comment: string }) => void;
}

export function StudentReviewsTabs({
  teacherOptions,
  reviews,
  onSubmit,
}: StudentReviewsTabsProps) {
  return (
    <Tabs defaultValue="list">
      <TabsList className="w-full md:w-fit">
        <TabsTrigger value="list">My Reviews</TabsTrigger>
        <TabsTrigger value="new">Write Review</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <StudentReviewList reviews={reviews} />
      </TabsContent>
      <TabsContent value="new">
        <StudentReviewForm teacherOptions={teacherOptions} onSubmit={onSubmit} />
      </TabsContent>
    </Tabs>
  );
}
