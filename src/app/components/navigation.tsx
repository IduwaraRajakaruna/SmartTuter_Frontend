import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useAuth } from '@/app/context/auth-context';
import {
  Home,
  BookOpen,
  Users,
  CreditCard,
  Star,
  User,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  FileText,
  UserCheck,
  BarChart,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/student/dashboard' },
          { icon: BookOpen, label: 'My Classes', to: '/student/classes' },
          { icon: FolderOpen, label: 'Materials', to: '/student/materials' },
          { icon: CreditCard, label: 'Payments', to: '/student/payments' },
          { icon: Star, label: 'Reviews', to: '/student/reviews' },
          { icon: User, label: 'Profile', to: '/student/profile' },
        ];
      case 'teacher':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/teacher/dashboard' },
          { icon: BookOpen, label: 'My Classes', to: '/teacher/classes' },
          { icon: FileText, label: 'Resources', to: '/teacher/resources' },
          { icon: Star, label: 'Feedback', to: '/teacher/feedback' },
          { icon: User, label: 'Profile', to: '/teacher/profile' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
          { icon: UserCheck, label: 'Teacher Approvals', to: '/admin/approvals' },
          { icon: Users, label: 'Users', to: '/admin/users' },
          { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
          { icon: FileText, label: 'Content', to: '/admin/content' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2 mr-8">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-xl">TuitionHub</span>
        </Link>

        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn('gap-2', isActive && 'bg-primary/10')}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p>{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/${user.role}/profile`} className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
