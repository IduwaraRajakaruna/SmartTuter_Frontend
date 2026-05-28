import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search } from 'lucide-react';

interface StudentClassesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  subjects: string[];
  statuses: string[];
}

export function StudentClassesFilters({
  searchTerm,
  onSearchChange,
  subjectFilter,
  onSubjectChange,
  statusFilter,
  onStatusChange,
  subjects,
  statuses,
}: StudentClassesFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search classes, subjects, or teachers"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={subjectFilter} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map(subject => (
            <SelectItem key={subject} value={subject} className="capitalize">
              {subject === 'all' ? 'All subjects' : subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(status => (
            <SelectItem key={status} value={status} className="capitalize">
              {status === 'all' ? 'All status' : status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
