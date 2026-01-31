import { useState } from 'react';
import { TeacherCard } from '@/app/components/teacher-card';
import { PublicNav } from '@/app/components/public-nav';
import { EmptyState } from '@/app/components/empty-state';
import { mockTeachers } from '@/app/lib/mock-data';
import { Input } from '@/app/components/ui/input';
import { Search } from 'lucide-react';

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
      <PublicNav />

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
          <EmptyState message="No teachers found matching your search" />
        )}
      </div>
    </div>
  );
}
