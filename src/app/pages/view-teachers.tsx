import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import axios from 'axios';
import { TeacherCard } from '@/app/components/teacher-card';
import { PublicNav } from '@/app/components/public-nav';
import { EmptyState } from '@/app/components/empty-state';
import { Input } from '@/app/components/ui/input';
import { Search } from 'lucide-react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';


type TeacherPublic = {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience?: number;
  bio?: string;
  status?: string;
  hourlyRate?: number;
  zoomLink?: string;
  // UI-only fields (backend may not provide rating)
  rating?: number;
  totalReviews?: number;
};

export function ViewTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/teachers/active`);
        const data = response.data?.teachers ?? response.data?.activeTeachers ?? [];
        setTeachers(data);
      } catch (e) {
        console.error(e);
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return teachers;

    return teachers.filter((teacher) => {
      const matchesSearch =
        (teacher.name || '').toLowerCase().includes(term) ||
        (teacher.subject || '').toLowerCase().includes(term) ||
        (teacher.qualification || '').toLowerCase().includes(term);

      return matchesSearch;
    });
  }, [teachers, searchTerm]);


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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
              onViewProfile={(id: string) => {
                window.location.href = `/teachers/${id}`;
              }}
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
