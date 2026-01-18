import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClassCard } from '@/app/components/class-card';
import { mockClasses } from '@/app/lib/mock-data';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { GraduationCap, Search } from 'lucide-react';

export function ViewClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const subjects = ['all', ...new Set(mockClasses.map(c => c.subject))];

  const filteredClasses = mockClasses.filter(classData => {
    const matchesSearch = classData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || classData.subject === subjectFilter;

    return matchesSearch && matchesSubject;
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

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Browse Available Classes</h1>
          <p className="text-muted-foreground">Find the perfect class for your learning journey</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search classes, subjects, or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject} className="capitalize">
                  {subject === 'all' ? 'All Subjects' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              onViewDetails={() => {}}
              onEnroll={() => {}}
            />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No classes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
