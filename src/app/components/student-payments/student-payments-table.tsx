import { Badge } from '@/app/components/ui/badge';
import { EmptyState } from '@/app/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Payment } from '@/app/lib/mock-data';

interface StudentPaymentsTableProps {
  payments: Payment[];
}

export function StudentPaymentsTable({ payments }: StudentPaymentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (payments.length === 0) {
    return <EmptyState message="No payment transactions found." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map(payment => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.className}</TableCell>
            <TableCell>₹{payment.amount}</TableCell>
            <TableCell className="capitalize">{payment.method}</TableCell>
            <TableCell>{payment.date}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(payment.status)}>
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
