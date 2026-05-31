const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ReviewRecord {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating?: number;
  totalStudents?: number;
}

export interface TeacherReviewsResponse {
  reviews: ReviewRecord[];
  summary: ReviewSummary;
}

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function requireToken(): string {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Missing auth token. Please sign in again.');
  }
  return token;
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function createReview(payload: {
  teacherId: string;
  classId: string;
  className: string;
  rating: number;
  comment: string;
}): Promise<ReviewRecord> {
  const token = requireToken();
  const response = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse<{ success: boolean; review?: ReviewRecord }>(response, 'Failed to submit review');
  if (!data.review) {
    throw new Error('No review returned from server');
  }
  return data.review;
}

export async function listMyReviews(): Promise<TeacherReviewsResponse> {
  const token = requireToken();
  const response = await fetch(`${API_BASE}/api/reviews/student/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<TeacherReviewsResponse>(response, 'Failed to load reviews');
}

export async function listTeacherReviews(teacherId = 'me'): Promise<TeacherReviewsResponse> {
  const token = requireToken();
  const response = await fetch(`${API_BASE}/api/reviews/teacher/${teacherId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<TeacherReviewsResponse>(response, 'Failed to load teacher reviews');
}
