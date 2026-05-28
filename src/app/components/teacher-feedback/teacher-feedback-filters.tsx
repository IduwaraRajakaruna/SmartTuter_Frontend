import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search } from 'lucide-react';

interface TeacherFeedbackFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  ratingFilter: string;
  onRatingChange: (value: string) => void;
}

export function TeacherFeedbackFilters({
  searchTerm,
  onSearchChange,
  ratingFilter,
  onRatingChange,
}: TeacherFeedbackFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search student name or comment"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={ratingFilter} onValueChange={onRatingChange}>
        <SelectTrigger className="w-full md:w-52">
          <SelectValue placeholder="Filter by rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All ratings</SelectItem>
          <SelectItem value="5">5 stars</SelectItem>
          <SelectItem value="4">4 stars</SelectItem>
          <SelectItem value="3">3 stars</SelectItem>
          <SelectItem value="2">2 stars</SelectItem>
          <SelectItem value="1">1 star</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
