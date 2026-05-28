import { useMemo, useState } from 'react';
import { TeacherFeedbackFilters } from '@/app/components/teacher-feedback/teacher-feedback-filters';
import { TeacherFeedbackList } from '@/app/components/teacher-feedback/teacher-feedback-list';
import { TeacherFeedbackSummary } from '@/app/components/teacher-feedback/teacher-feedback-summary';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses, mockReviews } from '@/app/lib/mock-data';

export function TeacherFeedbackPage() {
  const { user } = useAuth();
  const teacherId = user?.id ?? 't1';
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const teacherClasses = useMemo(() => {
    return mockClasses.filter(classData => classData.teacherId === teacherId);
  }, [teacherId]);

  const reviews = useMemo(() => {
    const baseReviews = mockReviews.filter(review => review.teacherId === teacherId);

    return baseReviews.filter(review => {
      const matchesSearch = review.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        || review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || review.rating === Number(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [teacherId, searchTerm, ratingFilter]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const totalStudents = teacherClasses.reduce((sum, classData) => sum + classData.studentsEnrolled, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Student Feedback</h1>
        <p className="text-muted-foreground">View ratings and reviews from your students</p>
      </div>

      <TeacherFeedbackSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
        totalStudents={totalStudents}
      />

      <TeacherFeedbackFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
      />

      <TeacherFeedbackList reviews={reviews} />
    </div>
  );
}
