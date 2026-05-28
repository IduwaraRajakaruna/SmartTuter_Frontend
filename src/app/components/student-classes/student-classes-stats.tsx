import { StatCard } from '@/app/components/stat-card';
import { BookOpen, Calendar, CreditCard, GraduationCap } from 'lucide-react';

interface StudentClassesStatsProps {
  total: number;
  active: number;
  upcoming: number;
  pendingPayments: number;
}

export function StudentClassesStats({
  total,
  active,
  upcoming,
  pendingPayments,
}: StudentClassesStatsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Enrolled Classes"
        value={total}
        icon={GraduationCap}
        description="Total enrolled"
        color="blue"
      />
      <StatCard
        title="Active Classes"
        value={active}
        icon={BookOpen}
        description="In progress"
        color="green"
      />
      <StatCard
        title="Upcoming Classes"
        value={upcoming}
        icon={Calendar}
        description="Starts soon"
        color="purple"
      />
      <StatCard
        title="Pending Payments"
        value={pendingPayments}
        icon={CreditCard}
        description="Needs attention"
        color="orange"
      />
    </div>
  );
}
