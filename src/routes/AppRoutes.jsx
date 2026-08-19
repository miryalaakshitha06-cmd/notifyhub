import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guard
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/LandingPage';
import PortalSelection from '../pages/PortalSelection';

// Auth Pages
import AdminLogin from '../pages/auth/AdminLogin';
import HodLogin from '../pages/auth/HodLogin';
import FacultyLogin from '../pages/auth/FacultyLogin';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentAnnouncements from '../pages/student/StudentAnnouncements';
import StudentEvents from '../pages/student/StudentEvents';
import StudentCalendar from '../pages/student/StudentCalendar';
import StudentQueries from '../pages/student/StudentQueries';
import StudentNotifications from '../pages/student/StudentNotifications';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminQueries from '../pages/admin/AdminQueries';
import AdminActivityLogs from '../pages/admin/AdminActivityLogs';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSettings from '../pages/admin/AdminSettings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Selection */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/portal-select" element={<PortalSelection />} />

      {/* Role Login Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/hod/login" element={<HodLogin />} />
      <Route path="/faculty/login" element={<FacultyLogin />} />

      {/* Student Portal */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="queries" element={<StudentQueries />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Protected Administration Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY']}>
            <AdminLayout title="Administration Control Center" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="queries" element={<AdminQueries />} />
        <Route
          path="activity"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HOD']}>
              <AdminActivityLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
