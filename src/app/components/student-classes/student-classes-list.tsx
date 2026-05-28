import { EmptyState } from '@/app/components/empty-state';
import { StudentClassCard } from '@/app/components/student-class-card';
import { Class } from '@/app/lib/mock-data';

interface StudentClassesListProps {
  classes: Class[];
  getPaymentStatus: (classId: string) => 'completed' | 'pending' | 'failed';
  onJoinClass: (classId: string) => void;
  onViewMaterials: (classId: string) => void;
  onViewPayments: (classId: string) => void;
}

export function StudentClassesList({
  classes,
  getPaymentStatus,
  onJoinClass,
  onViewMaterials,
  onViewPayments,
}: StudentClassesListProps) {
  if (classes.length === 0) {
    return <EmptyState message="No enrolled classes match your filters yet." />;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {classes.map(classData => (
        <StudentClassCard
          key={classData.id}
          classData={classData}
          paymentStatus={getPaymentStatus(classData.id)}
          onJoinClass={onJoinClass}
          onViewMaterials={onViewMaterials}
          onViewPayments={onViewPayments}
        />
      ))}
    </div>
  );
}
