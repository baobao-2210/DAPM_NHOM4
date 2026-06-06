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
import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';

// ── Staff / Nhân viên cứu hộ ──────────────────────────────────────────────────
import StaffDashboard     from './pages/staff/Dashboard';
import StaffPending       from './pages/staff/PendingRequests';
import StaffActive        from './pages/staff/ActiveRequests';
import StaffRequestDetail from './pages/staff/RequestDetail';
import StaffChat          from './pages/staff/Chat';
import StaffHistory       from './pages/staff/History';
import StaffProfile       from './pages/staff/Profile';
import StaffServices      from './pages/staff/StaffServices';
import StaffPrivateRoute  from './components/StaffPrivateRoute';
import StaffNotifications from './pages/staff/StaffNotifications';

// ── Customer ──────────────────────────────────────────────────
import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import CustomerProfile from './pages/Customer/Profile';
import CustomerVehicles from './pages/Customer/MyVehicles';
import CustomerRescueHistory from './pages/Customer/RescueRequestHistory';
import CustomerCreateRescue from './pages/Customer/CreateRescueRequest';
import CustomerRescueDetail from './pages/Customer/RescueRequestDetail';
import CustomerLiveTracking from './pages/Customer/LiveTracking';
import CustomerPayments from './pages/Customer/Payments';
import CustomerReviews from './pages/Customer/Reviews';
import CustomerComplaints from './pages/Customer/Complaints';

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
          {/* Guest routes (includes auth pages with shared header/footer) */}
          <Route element={<GuestLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services"     element={<ServiceListPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
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
              <Route index element={<StaffDashboard />} />
              <Route path="pending" element={<StaffPending />} />
              <Route path="active" element={<StaffActive />} />
              
              {/* Other pages */}
              <Route path="yeucau/:id" element={<StaffRequestDetail />} />
              <Route path="messages" element={<StaffChat />} />
              <Route path="chat/:id" element={<StaffChat />} />
              <Route path="history" element={<StaffHistory />} />
              <Route path="profile" element={<StaffProfile />} />
              <Route path="services" element={<StaffServices />} />
              <Route path="notifications" element={<StaffNotifications />} />
              <Route path="earnings" element={<PlaceholderPage title="Thu nhập" />} />
              <Route path="reviews" element={<PlaceholderPage title="Đánh giá" />} />
            </Route>
          </Route>

          {/* ── Customer ── */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="vehicles" element={<CustomerVehicles />} />
            <Route path="rescue-requests" element={<CustomerRescueHistory />} />
            <Route path="rescue-requests/create" element={<CustomerCreateRescue />} />
            <Route path="rescue-requests/:id" element={<CustomerRescueDetail />} />
            <Route path="rescue-requests/:id/tracking" element={<CustomerLiveTracking />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="reviews" element={<CustomerReviews />} />
            <Route path="complaints" element={<CustomerComplaints />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}