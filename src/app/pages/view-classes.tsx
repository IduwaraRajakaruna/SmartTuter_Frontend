import { useState } from 'react';
import { ClassCard } from '@/app/components/class-card';
import { PublicNav } from '@/app/components/public-nav';
import { EmptyState } from '@/app/components/empty-state';
import { EnrollmentDialog } from '@/app/components/enrollment-dialog';
import { mockClasses, Class } from '@/app/lib/mock-data';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export function ViewClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const subjects = ['all', ...new Set(mockClasses.map(c => c.subject))];

  const filteredClasses = mockClasses.filter(classData => {
    const matchesSearch = classData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || classData.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  const handleEnroll = (classId: string) => {
    const classData = mockClasses.find(c => c.id === classId);
    if (classData) {
      setSelectedClass(classData);
      setIsEnrollDialogOpen(true);
    }
  };

  const handleViewDetails = (classId: string) => {
    toast.info('Class details page - To be implemented');
  };

  const handleEnrollSuccess = () => {
    toast.success('Successfully enrolled! Check your dashboard.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNav />

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
              onViewDetails={handleViewDetails}
              onEnroll={handleEnroll}
            />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <EmptyState message="No classes found matching your criteria" />
        )}
      </div>

      <EnrollmentDialog
        classData={selectedClass}
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
}
