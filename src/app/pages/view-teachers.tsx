import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TeacherCard } from '@/app/components/teacher-card';
import { mockTeachers } from '@/app/lib/mock-data';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { GraduationCap, Search } from 'lucide-react';

export function ViewTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Only show active teachers to public
  const activeTeachers = mockTeachers.filter(t => t.status === 'active');

  const filteredTeachers = activeTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Meet Our Expert Teachers</h1>
          <p className="text-muted-foreground">Learn from experienced and qualified educators</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onViewProfile={() => {}}
            />
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No teachers found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
