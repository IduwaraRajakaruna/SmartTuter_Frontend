import { Loader2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 20, className, label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-muted-foreground', className)}>
      <Loader2 className="animate-spin" size={size} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
