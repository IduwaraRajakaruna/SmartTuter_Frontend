import { Navigation } from '@/app/components/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
