import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'cyan' | 'pink';
}

export function StatCard({ title, value, icon: Icon, description, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary',
    purple: 'bg-secondary/15 text-primary',
    green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    orange: 'bg-accent/15 text-accent',
    cyan: 'bg-secondary/20 text-secondary-foreground',
    pink: 'bg-accent/20 text-accent',
  };

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl mt-2">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
            {trend && (
              <p className={`text-xs mt-2 ${trend.isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}