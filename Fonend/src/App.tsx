import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import GuestLayout from './layouts/GuestLayout';
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
import RegisterPage from './pages/guest/RegisterPage';
import LoginPage from './pages/guest/LoginPage';
import ForgotPasswordPage from './pages/guest/ForgotPasswordPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 12 }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 700 }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tính năng đang được phát triển.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="reports" element={<PlaceholderPage title="Báo Cáo & Thống Kê" />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<PlaceholderPage title="Cài Đặt Hệ Thống" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
