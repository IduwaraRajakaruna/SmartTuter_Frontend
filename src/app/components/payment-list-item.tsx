import { Payment } from '@/app/lib/mock-data';
import { Badge } from '@/app/components/ui/badge';

interface PaymentListItemProps {
  payment: Payment;
}

export function PaymentListItem({ payment }: PaymentListItemProps) {
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

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{payment.className}</p>
        <p className="text-sm text-muted-foreground">{payment.date}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">Rs {payment.amount}</p>
        <Badge className={getStatusColor(payment.status)}>
          {payment.status}
        </Badge>
      </div>
    </div>
  );
}
