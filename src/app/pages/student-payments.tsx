import { useMemo, useState } from 'react';
import { StudentPaymentsFilters } from '@/app/components/student-payments/student-payments-filters';
import { StudentPaymentsSummary } from '@/app/components/student-payments/student-payments-summary';
import { StudentPaymentsTable } from '@/app/components/student-payments/student-payments-table';
import { useAuth } from '@/app/context/auth-context';
import { mockPayments } from '@/app/lib/mock-data';

const statusFilters = ['all', 'completed', 'pending', 'failed'] as const;

export function StudentPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const { user } = useAuth();
  const studentId = user?.id ?? 's1';

  const studentPayments = useMemo(() => {
    return mockPayments.filter(payment => payment.studentId === studentId);
  }, [studentId]);

  const filteredPayments = studentPayments.filter(payment => {
    const matchesSearch = payment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    totalSpent: studentPayments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0),
    completedCount: studentPayments.filter(payment => payment.status === 'completed').length,
    pendingCount: studentPayments.filter(payment => payment.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Payments</h1>
        <p className="text-muted-foreground">View all your payment transactions</p>
      </div>

      <StudentPaymentsSummary
        totalSpent={summary.totalSpent}
        completedCount={summary.completedCount}
        pendingCount={summary.pendingCount}
      />

      <StudentPaymentsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={(value) => setStatusFilter(value as any)}
        statuses={Array.from(statusFilters)}
      />

      <StudentPaymentsTable payments={filteredPayments} />
    </div>
  );
}
