import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { GraduationCap } from 'lucide-react';

export function PublicNav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-2xl">TuitionHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/classes">
            <Button variant="ghost">Browse Classes</Button>
          </Link>
          <Link to="/teachers">
            <Button variant="ghost">Our Teachers</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
