// Mock data for the Online Tuition Class Management Platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

export interface Teacher extends User {
  role: 'teacher';
  subject: string;
  experience: number;
  rating: number;
  totalReviews: number;
  bio: string;
  qualification: string;
}

export interface Class {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  description: string;
  schedule: string;
  zoomLink: string;
  price: number;
  studentsEnrolled: number;
  maxStudents: number;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
}

export interface StudyMaterial {
  id: string;
  classId: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  uploadedDate: string;
  size?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: 'card' | 'upi' | 'netbanking';
}

export interface Review {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@tuition.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2024-01-01',
  },
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@tuition.com',
    role: 'teacher',
    status: 'active',
    subject: 'Mathematics',
    experience: 8,
    rating: 4.8,
    totalReviews: 124,
    bio: 'Passionate mathematics educator with a PhD in Applied Mathematics',
    qualification: 'PhD in Applied Mathematics',
    joinedDate: '2024-01-15',
  },
  {
    id: 't2',
    name: 'Prof. Michael Chen',
    email: 'michael@tuition.com',
    role: 'teacher',
    status: 'active',
    subject: 'Physics',
    experience: 12,
    rating: 4.9,
    totalReviews: 203,
    bio: 'Former university professor specializing in quantum mechanics',
    qualification: 'PhD in Physics',
    joinedDate: '2024-01-20',
  },
  {
    id: 't3',
    name: 'Emma Williams',
    email: 'emma@tuition.com',
    role: 'teacher',
    status: 'pending',
    subject: 'Chemistry',
    experience: 5,
    rating: 4.6,
    totalReviews: 87,
    bio: 'Experienced chemistry tutor with focus on organic chemistry',
    qualification: 'MSc in Chemistry',
    joinedDate: '2026-01-10',
  },
  {
    id: 't4',
    name: 'James Anderson',
    email: 'james@tuition.com',
    role: 'teacher',
    status: 'active',
    subject: 'English Literature',
    experience: 10,
    rating: 4.7,
    totalReviews: 156,
    bio: 'Award-winning English literature educator',
    qualification: 'MA in English Literature',
    joinedDate: '2024-02-01',
  },
];

// Mock Students
export const mockStudents: User[] = [
  {
    id: 's1',
    name: 'John Smith',
    email: 'john@student.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-03-01',
  },
  {
    id: 's2',
    name: 'Emily Davis',
    email: 'emily@student.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-03-05',
  },
  {
    id: 's3',
    name: 'Robert Brown',
    email: 'robert@student.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-03-10',
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: 'c1',
    title: 'Advanced Calculus - Complete Course',
    subject: 'Mathematics',
    teacherId: 't1',
    teacherName: 'Dr. Sarah Johnson',
    description: 'Comprehensive calculus course covering differential and integral calculus',
    schedule: 'Mon, Wed, Fri - 6:00 PM to 7:30 PM',
    zoomLink: 'https://zoom.us/j/1234567890',
    price: 5000,
    studentsEnrolled: 25,
    maxStudents: 30,
    status: 'active',
    startDate: '2026-01-20',
    endDate: '2026-04-20',
  },
  {
    id: 'c2',
    title: 'Quantum Physics Fundamentals',
    subject: 'Physics',
    teacherId: 't2',
    teacherName: 'Prof. Michael Chen',
    description: 'Introduction to quantum mechanics and modern physics',
    schedule: 'Tue, Thu - 7:00 PM to 8:30 PM',
    zoomLink: 'https://zoom.us/j/9876543210',
    price: 6000,
    studentsEnrolled: 18,
    maxStudents: 25,
    status: 'active',
    startDate: '2026-01-18',
    endDate: '2026-04-18',
  },
  {
    id: 'c3',
    title: 'Organic Chemistry Mastery',
    subject: 'Chemistry',
    teacherId: 't3',
    teacherName: 'Emma Williams',
    description: 'Deep dive into organic chemistry concepts and reactions',
    schedule: 'Mon, Wed - 5:00 PM to 6:30 PM',
    zoomLink: 'https://zoom.us/j/5555555555',
    price: 4500,
    studentsEnrolled: 22,
    maxStudents: 30,
    status: 'upcoming',
    startDate: '2026-02-01',
    endDate: '2026-05-01',
  },
  {
    id: 'c4',
    title: 'Shakespeare and Modern Literature',
    subject: 'English Literature',
    teacherId: 't4',
    teacherName: 'James Anderson',
    description: 'Exploring classic and contemporary English literature',
    schedule: 'Sat, Sun - 10:00 AM to 11:30 AM',
    zoomLink: 'https://zoom.us/j/7777777777',
    price: 4000,
    studentsEnrolled: 15,
    maxStudents: 20,
    status: 'active',
    startDate: '2026-01-17',
    endDate: '2026-04-17',
  },
];

// Mock Study Materials
export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: 'm1',
    classId: 'c1',
    title: 'Calculus Introduction - Week 1',
    type: 'pdf',
    url: '/materials/calculus-week1.pdf',
    uploadedDate: '2026-01-16',
    size: '2.5 MB',
  },
  {
    id: 'm2',
    classId: 'c1',
    title: 'Differentiation Practice Problems',
    type: 'pdf',
    url: '/materials/calculus-practice.pdf',
    uploadedDate: '2026-01-16',
    size: '1.8 MB',
  },
  {
    id: 'm3',
    classId: 'c2',
    title: 'Quantum Mechanics Lecture Notes',
    type: 'pdf',
    url: '/materials/quantum-notes.pdf',
    uploadedDate: '2026-01-16',
    size: '3.2 MB',
  },
  {
    id: 'm4',
    classId: 'c2',
    title: 'Introduction to Wave Functions',
    type: 'video',
    url: 'https://youtube.com/watch?v=example',
    uploadedDate: '2026-01-16',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'p1',
    studentId: 's1',
    studentName: 'John Smith',
    classId: 'c1',
    className: 'Advanced Calculus - Complete Course',
    amount: 5000,
    status: 'completed',
    date: '2026-01-15',
    method: 'card',
  },
  {
    id: 'p2',
    studentId: 's2',
    studentName: 'Emily Davis',
    classId: 'c2',
    className: 'Quantum Physics Fundamentals',
    amount: 6000,
    status: 'completed',
    date: '2026-01-14',
    method: 'upi',
  },
  {
    id: 'p3',
    studentId: 's3',
    studentName: 'Robert Brown',
    classId: 'c4',
    className: 'Shakespeare and Modern Literature',
    amount: 4000,
    status: 'pending',
    date: '2026-01-16',
    method: 'netbanking',
  },
  {
    id: 'p4',
    studentId: 's1',
    studentName: 'John Smith',
    classId: 'c4',
    className: 'Shakespeare and Modern Literature',
    amount: 4000,
    status: 'completed',
    date: '2026-01-12',
    method: 'card',
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'r1',
    teacherId: 't1',
    studentId: 's1',
    studentName: 'John Smith',
    rating: 5,
    comment: 'Excellent teaching methodology. Concepts are explained very clearly!',
    date: '2026-01-14',
  },
  {
    id: 'r2',
    teacherId: 't1',
    studentId: 's2',
    studentName: 'Emily Davis',
    rating: 5,
    comment: 'Dr. Johnson makes calculus easy to understand. Highly recommended!',
    date: '2026-01-13',
  },
  {
    id: 'r3',
    teacherId: 't2',
    studentId: 's1',
    studentName: 'John Smith',
    rating: 5,
    comment: 'Best physics teacher I have ever had. Complex topics made simple.',
    date: '2026-01-12',
  },
  {
    id: 'r4',
    teacherId: 't2',
    studentId: 's3',
    studentName: 'Robert Brown',
    rating: 4,
    comment: 'Very knowledgeable and patient. Sometimes goes a bit fast though.',
    date: '2026-01-11',
  },
  {
    id: 'r5',
    teacherId: 't4',
    studentId: 's2',
    studentName: 'Emily Davis',
    rating: 5,
    comment: 'Passionate teacher who brings literature to life!',
    date: '2026-01-10',
  },
];
