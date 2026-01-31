import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function FeatureCard({ icon: Icon, title, description, color, bgColor }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-none shadow-md">
      <CardContent className="p-6">
        <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
          <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
