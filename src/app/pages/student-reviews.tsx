import { useEffect, useMemo, useState } from 'react';
import { StudentReviewsTabs } from '@/app/components/student-reviews/student-reviews-tabs';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockTeachers } from '@/app/lib/mock-data';
import { getStoredClasses } from '@/app/lib/classes-storage';
import { seedPayments, getStoredPayments } from '@/app/lib/payments-storage';
import { toast } from 'sonner';
import { createReview, listMyReviews, type ReviewRecord } from '@/services/reviewsService';

type StudentReviewItem = ReviewRecord;

export function StudentReviewsPage() {
  const { user } = useAuth();
  const studentId = user?.id ?? 's1';
  const [reviews, setReviews] = useState<StudentReviewItem[]>([]);

  const teacherOptions = useMemo(() => {
    seedPayments();
    const classCatalog = getStoredClasses();
    const availableClasses = classCatalog.length > 0 ? classCatalog : mockClasses;
    const enrolledClassIds = getStoredPayments()
      .filter(payment => payment.studentId === studentId && payment.status === 'completed')
      .map(payment => payment.classId);

    const teacherIds = new Set(
      availableClasses
        .filter(classData => enrolledClassIds.includes(classData.id))
        .map(classData => classData.teacherId),
    );

    return availableClasses
      .filter(classData => enrolledClassIds.includes(classData.id) && teacherIds.has(classData.teacherId))
      .map(classData => ({
        id: classData.teacherId,
        name: mockTeachers.find(teacher => teacher.id === classData.teacherId)?.name ?? classData.teacherName,
        classId: classData.id,
        className: classData.title,
      }));
  }, [studentId]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await listMyReviews();
        setReviews(response.reviews);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load your reviews');
      }
    };

    loadReviews();
  }, []);

  const handleSubmitReview = async (payload: { teacherId: string; classId: string; className: string; rating: number; comment: string }) => {
    try {
      const created = await createReview(payload);
      setReviews(prev => [created, ...prev.filter(review => review.id !== created.id)]);
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Unable to submit review');
    }
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
