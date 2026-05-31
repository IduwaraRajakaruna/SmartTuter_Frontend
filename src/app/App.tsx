import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/app/context/auth-context';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from '@/app/components/ui/sonner';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';

// Public Pages
import { LandingPage } from '@/app/pages/landing';
import { LoginPage } from '@/app/pages/login';
import { RegisterPage } from '@/app/pages/register';
import { ViewClassesPage } from '@/app/pages/view-classes';
import { ViewTeachersPage } from '@/app/pages/view-teachers';

// Student Pages
import { StudentDashboard } from '@/app/pages/student-dashboard';
import { StudentMaterialsPage } from '@/app/pages/student-materials';
import { StudentClassesPage } from '@/app/pages/student-classes';
import { StudentPaymentsPage } from '@/app/pages/student-payments';
import { StudentReviewsPage } from '@/app/pages/student-reviews';
import { StudentProfilePage } from '@/app/pages/student-profile';

// Teacher Pages
import { TeacherDashboard } from '@/app/pages/teacher-dashboard';
import { ManageClasses } from '@/app/pages/teacher-manage-classes';
import { CreateClass } from '@/app/pages/teacher-create-class';
import { StudyMaterialsPage } from '@/app/pages/teacher-materials';
import { TeacherFeedbackPage } from '@/app/pages/teacher-feedback';
import { TeacherProfilePage } from '@/app/pages/teacher-profile';
import { TeacherPublicProfilePage } from '@/app/pages/teacher-public-profile';


// Admin Pages
import { AdminDashboard } from '@/app/pages/admin-dashboard';
import { AdminApprovalsPage } from '@/app/pages/admin-approvals';
import { AdminUsersPage } from '@/app/pages/admin-users';
import { AdminPaymentsPage } from '@/app/pages/admin-payments';
import { AdminContentPage } from '@/app/pages/admin-content';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

// App Router
function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/classes" element={<ViewClassesPage />} />
      <Route path="/teachers" element={<ViewTeachersPage />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/classes"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentClassesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/materials"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentMaterialsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/payments"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentPaymentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/reviews"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentReviewsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <StudentProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <ManageClasses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes/create"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <CreateClass />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/resources"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <StudyMaterialsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/feedback"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherFeedbackPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminApprovalsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminUsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminPaymentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminContentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Public teacher profile */}
      <Route path="/teachers/:teacherId" element={<TeacherPublicProfilePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
