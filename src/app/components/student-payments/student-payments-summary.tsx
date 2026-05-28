import { StatCard } from '@/app/components/stat-card';
import { CreditCard, Receipt, Wallet } from 'lucide-react';

interface StudentPaymentsSummaryProps {
  totalSpent: number;
  completedCount: number;
  pendingCount: number;
}

export function StudentPaymentsSummary({
  totalSpent,
  completedCount,
  pendingCount,
}: StudentPaymentsSummaryProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Spent"
        value={`Rs ${totalSpent.toLocaleString()}`}
        icon={Wallet}
        description="Completed payments"
        color="green"
      />
      <StatCard
        title="Completed"
        value={completedCount}
        icon={Receipt}
        description="Transactions"
        color="blue"
      />
      <StatCard
        title="Pending"
        value={pendingCount}
        icon={CreditCard}
        description="Requires action"
        color="orange"
      />
    </div>
  );
}
