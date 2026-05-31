export interface TeacherApproval {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'inactive';
  subject: string;
  qualification: string;
  experience: number;
  joinedDate: string;
}
