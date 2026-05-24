import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import DashboardLayout from './layouts/DashboardLayout';
import StaffLayout from './layouts/StaffLayout';
import GuestLayout from './layouts/GuestLayout';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import RequestsPage from './pages/admin/RequestsPage';
import StaffPage from './pages/admin/StaffPage';
import VehiclesPage from './pages/admin/VehiclesPage';
import ServicesPage from './pages/admin/ServicesPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import MapPage from './pages/admin/MapPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import HomePage from './pages/guest/HomePage';
import ServiceListPage from './pages/guest/ServiceListPage';
import ServiceDetailPage from './pages/guest/ServiceDetailPage';
import ForgotPasswordPage from './pages/guest/ForgotPasswordPage';
import Auth from './pages/Customer/Auth';

// ── Staff / Nhân viên cứu hộ ──────────────────────────────────────────────────
import StaffDashboard     from './pages/staff/Dashboard';
import StaffRequestDetail from './pages/staff/RequestDetail';
import StaffChat          from './pages/staff/Chat';
import StaffHistory       from './pages/staff/History';
import StaffProfile       from './pages/staff/Profile';
import StaffServices      from './pages/staff/Services';
import StaffPrivateRoute  from './components/StaffPrivateRoute';
import StaffNotifications from './pages/staff/Notifications';

const queryClient = new QueryClient();

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'50vh', gap:12 }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <h2 style={{ fontSize:22, fontWeight:700 }}>{title}</h2>
      <p style={{ color:'var(--text-muted)', fontSize:14 }}>Tính năng đang được phát triển.</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* ── Auth ── */}
          <Route path="/login"    element={<Auth />} />
          <Route path="/register" element={<Auth initialIsLogin={false} />} />

          {/* ── Guest ── */}
          <Route element={<GuestLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services"     element={<ServiceListPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"     element={<DashboardPage />} />
            <Route path="map"           element={<MapPage />} />
            <Route path="requests"      element={<RequestsPage />} />
            <Route path="requests/:id"  element={<RequestsPage />} />
            <Route path="staff"         element={<StaffPage />} />
            <Route path="vehicles"      element={<VehiclesPage />} />
            <Route path="services"      element={<ServicesPage />} />
            <Route path="reports"       element={<PlaceholderPage title="Báo Cáo & Thống Kê" />} />
            <Route path="users"         element={<AdminUsersPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings"      element={<PlaceholderPage title="Cài Đặt Hệ Thống" />} />
          </Route>

          {/* ── Partner / Nhân viên cứu hộ ── */}
          <Route path="/partner/login" element={<Navigate to="/login" replace />} />

          <Route element={<StaffPrivateRoute />}>
            <Route path="/partner" element={<StaffLayout />}>
              {/* UC-21: Trang chủ — đơn chờ + đang xử lý */}
              <Route index element={<StaffDashboard />} />

              {/* UC-22/23/24: Chi tiết + cập nhật trạng thái + hoàn thành */}
              <Route path="yeucau/:id" element={<StaffRequestDetail />} />

              {/* UC-25: Chat với khách hàng & Inbox */}
              <Route path="messages" element={<StaffChat />} />
              <Route path="chat/:id" element={<StaffChat />} />

              {/* UC-26: Lịch cứu hộ theo tháng */}
              <Route path="history" element={<StaffHistory />} />

              {/* UC-27: Cập nhật thông tin cá nhân */}
              <Route path="profile" element={<StaffProfile />} />

              {/* UC-28: Cập nhật dịch vụ cung cấp */}
              <Route path="services" element={<StaffServices />} />
              <Route path="notifications" element={<StaffNotifications />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}