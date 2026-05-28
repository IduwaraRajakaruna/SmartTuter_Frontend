import { useMemo, useState } from 'react';
import { StudentReviewsTabs } from '@/app/components/student-reviews/student-reviews-tabs';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockPayments, mockReviews, mockTeachers } from '@/app/lib/mock-data';
import { toast } from 'sonner';

export function StudentReviewsPage() {
  const { user } = useAuth();
  const studentId = user?.id ?? 's1';

  const teacherOptions = useMemo(() => {
    const enrolledClassIds = mockPayments
      .filter(payment => payment.studentId === studentId)
      .map(payment => payment.classId);

    const teacherIds = new Set(
      mockClasses
        .filter(classData => enrolledClassIds.includes(classData.id))
        .map(classData => classData.teacherId),
    );

    return mockTeachers
      .filter(teacher => teacherIds.has(teacher.id))
      .map(teacher => ({ id: teacher.id, name: teacher.name }));
  }, [studentId]);

  const [reviews, setReviews] = useState(() => {
    return mockReviews
      .filter(review => review.studentId === studentId)
      .map(review => ({
        id: review.id,
        teacherName: mockTeachers.find(t => t.id === review.teacherId)?.name ?? 'Teacher',
        rating: review.rating,
        comment: review.comment,
        date: review.date,
      }));
  });

  const handleSubmitReview = (payload: { teacherId: string; rating: number; comment: string }) => {
    const teacherName = mockTeachers.find(t => t.id === payload.teacherId)?.name ?? 'Teacher';
    const newReview = {
      id: `review-${Date.now()}`,
      teacherName,
      rating: payload.rating,
      comment: payload.comment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews(prev => [newReview, ...prev]);
    toast.success('Review submitted successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Reviews</h1>
        <p className="text-muted-foreground">Rate and review your teachers</p>
      </div>

      <StudentReviewsTabs
        teacherOptions={teacherOptions}
        reviews={reviews}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
