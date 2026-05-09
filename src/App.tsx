import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import StaffPage from './pages/StaffPage';
import VehiclesPage from './pages/VehiclesPage';
import ServicesPage from './pages/ServicesPage';
import NotificationsPage from './pages/NotificationsPage';
import MapPage from './pages/MapPage';

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
          <Route path="users" element={<PlaceholderPage title="Quản Lý Tài Khoản" />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<PlaceholderPage title="Cài Đặt Hệ Thống" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
