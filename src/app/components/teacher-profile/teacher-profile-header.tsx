import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Award, Mail } from 'lucide-react';

interface TeacherProfileHeaderProps {
  name: string;
  email: string;
  subject?: string;
  status?: 'active' | 'inactive' | 'pending';
  qualification?: string;
}

export function TeacherProfileHeader({
  name,
  email,
  subject,
  status = 'active',
  qualification,
}: TeacherProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const statusStyles = status === 'active'
    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
    : status === 'pending'
    ? 'bg-accent/15 text-accent border-accent/30'
    : 'bg-muted text-muted-foreground border-border';

  return (
    <Card className="border-none bg-gradient-to-r from-primary/90 to-secondary/70 text-white dark:from-primary/40 dark:to-secondary/30">
      <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 border border-white/40">
            <AvatarFallback className="bg-white/20 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">Teacher Profile</p>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {email}
              </span>
              {qualification && (
                <span className="inline-flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {qualification}
                </span>
              )}
              {subject && (
                <span className="text-xs rounded-full border border-white/30 px-3 py-1">
                  {subject}
                </span>
              )}
            </div>
          </div>
        </div>
        <Badge className={statusStyles}>{status}</Badge>
      </CardContent>
    </Card>
  );
}
