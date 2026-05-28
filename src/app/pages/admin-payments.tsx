import { useMemo, useState } from 'react';
import { CreditCard, TrendingUp, AlertTriangle, Search } from 'lucide-react';
import { StatCard } from '@/app/components/stat-card';
import { mockPayments } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { EmptyState } from '@/app/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

export function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const failedPayments = mockPayments.filter(p => p.status === 'failed');

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return mockPayments.filter(payment => {
      const matchesTerm =
        !term ||
        payment.studentName.toLowerCase().includes(term) ||
        payment.className.toLowerCase().includes(term) ||
        payment.method.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

      return matchesTerm && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Payment Monitoring</h1>
        <p className="text-muted-foreground">View and manage all transactions</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`Rs ${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          description="Completed payments"
          color="green"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments.length}
          icon={AlertTriangle}
          description="Awaiting confirmation"
          color="orange"
        />
        <StatCard
          title="Failed Payments"
          value={failedPayments.length}
          icon={AlertTriangle}
          description="Need review"
          color="pink"
        />
        <StatCard
          title="All Transactions"
          value={mockPayments.length}
          icon={CreditCard}
          description="Total records"
          color="blue"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search student, class, method"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'completed', 'pending', 'failed'] as const).map(status => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={statusFilter === status ? 'secondary' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'border-primary/20 text-primary' : ''}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <EmptyState message="No payments match your filters" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{payment.className}</TableCell>
                    <TableCell>Rs {payment.amount}</TableCell>
                    <TableCell className="capitalize">{payment.method}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
