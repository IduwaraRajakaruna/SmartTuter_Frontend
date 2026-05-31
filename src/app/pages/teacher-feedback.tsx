import { useEffect, useMemo, useState } from 'react';
import { TeacherFeedbackFilters } from '@/app/components/teacher-feedback/teacher-feedback-filters';
import { TeacherFeedbackList } from '@/app/components/teacher-feedback/teacher-feedback-list';
import { TeacherFeedbackSummary } from '@/app/components/teacher-feedback/teacher-feedback-summary';
import { useAuth } from '@/app/context/auth-context';
import { mockClasses } from '@/app/lib/mock-data';
import { getStoredClasses } from '@/app/lib/classes-storage';
import { listTeacherReviews, type ReviewRecord } from '@/services/reviewsService';
import { toast } from 'sonner';

export function TeacherFeedbackPage() {
  const { user } = useAuth();
  const teacherId = user?.id ?? 't1';
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [averageRating, setAverageRating] = useState('0.0');
  const [totalReviews, setTotalReviews] = useState(0);

  const teacherClasses = useMemo(() => {
    const storedClasses = getStoredClasses();
    const availableClasses = storedClasses.length > 0 ? storedClasses : mockClasses;
    return availableClasses.filter(classData => classData.teacherId === teacherId);
  }, [teacherId]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await listTeacherReviews(teacherId);
        setReviews(response.reviews);
        setAverageRating((response.summary.averageRating ?? 0).toFixed(1));
        setTotalReviews(response.summary.totalReviews);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load student feedback');
      }
    };

    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        || review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || review.rating === Number(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const totalStudents = teacherClasses.reduce((sum, classData) => sum + classData.studentsEnrolled, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Student Feedback</h1>
        <p className="text-muted-foreground">View ratings and reviews from your students</p>
      </div>

      <TeacherFeedbackSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalStudents={totalStudents}
      />

      <TeacherFeedbackFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
      />

      <TeacherFeedbackList reviews={filteredReviews} />
    </div>
  );
}
