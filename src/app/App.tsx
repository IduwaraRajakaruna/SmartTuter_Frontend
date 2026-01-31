import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/app/context/auth-context';
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

// Teacher Pages
import { TeacherDashboard } from '@/app/pages/teacher-dashboard';
import { ManageClasses } from '@/app/pages/teacher-manage-classes';
import { CreateClass } from '@/app/pages/teacher-create-class';
import { StudyMaterialsPage } from '@/app/pages/teacher-materials';

// Admin Pages
import { AdminDashboard } from '@/app/pages/admin-dashboard';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

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
              <div className="p-6">
                <h1 className="text-3xl mb-4">My Classes</h1>
                <p className="text-muted-foreground">View and manage your enrolled classes</p>
              </div>
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
              <div className="p-6">
                <h1 className="text-3xl mb-4">Payment History</h1>
                <p className="text-muted-foreground">View your payment transactions</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/reviews"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">My Reviews</h1>
                <p className="text-muted-foreground">Rate and review your teachers</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">My Profile</h1>
                <p className="text-muted-foreground">Manage your account settings</p>
              </div>
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
              <div className="p-6">
                <h1 className="text-3xl mb-4">Student Feedback</h1>
                <p className="text-muted-foreground">View ratings and reviews from students</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">Teacher Profile</h1>
                <p className="text-muted-foreground">Manage your professional profile</p>
              </div>
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
              <div className="p-6">
                <h1 className="text-3xl mb-4">Teacher Approvals</h1>
                <p className="text-muted-foreground">Review and approve teacher registrations</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">User Management</h1>
                <p className="text-muted-foreground">Manage students and teachers</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">Payment Monitoring</h1>
                <p className="text-muted-foreground">View and manage all transactions</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl mb-4">Content Monitoring</h1>
                <p className="text-muted-foreground">Monitor uploaded study materials</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}
