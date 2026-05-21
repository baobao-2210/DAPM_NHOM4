import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Staff / Nhân viên cứu hộ ──────────────────────────────────────────────────
import StaffDashboard     from './pages/staff/Dashboard';
import StaffRequestDetail from './pages/staff/RequestDetail'; // UC-22/23/24 ← MỚI
import StaffChat          from './pages/staff/Chat';
import StaffHistory       from './pages/staff/History';
import StaffProfile       from './pages/staff/Profile';
import StaffServices      from './pages/staff/Services';       // UC-28 ← MỚI

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import StaffLayout     from './layouts/StaffLayout';
import Navbar          from './components/Navbar';

// Customer Pages
import Auth            from './pages/Customer/Auth';
import ServiceDetail   from './pages/Customer/ServiceDetail';
import RescueRequest   from './pages/Customer/RescueRequest';
import RescueHistory   from './pages/Customer/RescueHistory';
import RescueTracking  from './pages/Customer/RescueTracking';
import CancelRequest   from './pages/Customer/CancelRequest';
import RescueComplete  from './pages/Customer/RescueComplete';
import CostEstimation  from './pages/Customer/CostEstimation';
import UserProfile     from './pages/Customer/UserProfile';
import Support         from './pages/Customer/Support';
import Feedback        from './pages/Customer/Feedback';

// Admin Pages
import AdminUsersPage      from './pages/admin/AdminUsersPage';
import DashboardPage       from './pages/admin/DashboardPage';
import RequestsPage        from './pages/admin/RequestsPage';
import StaffPage           from './pages/admin/StaffPage';
import VehiclesPage        from './pages/admin/VehiclesPage';
import ServicesPage        from './pages/admin/ServicesPage';
import MapPage             from './pages/admin/MapPage';
import NotificationsPage   from './pages/admin/NotificationsPage';
import ComplaintsPage      from './pages/admin/ComplaintsPage';
import ReportPage          from './pages/admin/ReportPage';
import SystemSettingsPage  from './pages/admin/SystemSettingsPage';

const queryClient = new QueryClient();

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>

            {/* ── Auth ── */}
            <Route path="/login"    element={<Auth />} />
            <Route path="/register" element={<Auth initialIsLogin={false} />} />
            <Route path="/"         element={<Navigate to="/login" replace />} />

            {/* ── Customer ── */}
            <Route path="/detail"      element={<CustomerLayout><ServiceDetail /></CustomerLayout>} />
            <Route path="/request"     element={<CustomerLayout><RescueRequest /></CustomerLayout>} />
            <Route path="/history"     element={<CustomerLayout><RescueHistory /></CustomerLayout>} />
            <Route path="/tracking"    element={<CustomerLayout><RescueTracking /></CustomerLayout>} />
            <Route path="/cancel"      element={<CustomerLayout><CancelRequest /></CustomerLayout>} />
            <Route path="/complete"    element={<CustomerLayout><RescueComplete /></CustomerLayout>} />
            <Route path="/estimation"  element={<CustomerLayout><CostEstimation /></CustomerLayout>} />
            <Route path="/support"     element={<CustomerLayout><Support /></CustomerLayout>} />
            <Route path="/feedback"    element={<CustomerLayout><Feedback /></CustomerLayout>} />
            <Route path="/profile"     element={<CustomerLayout><UserProfile /></CustomerLayout>} />

            {/* ── Admin ── */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard"      element={<DashboardPage />} />
                <Route path="users"          element={<AdminUsersPage />} />
                <Route path="requests"       element={<RequestsPage />} />
                <Route path="staff"          element={<StaffPage />} />
                <Route path="vehicles"       element={<VehiclesPage />} />
                <Route path="services"       element={<ServicesPage />} />
                <Route path="map"            element={<MapPage />} />
                <Route path="notifications"  element={<NotificationsPage />} />
                <Route path="complaints"     element={<ComplaintsPage />} />
                <Route path="reports"        element={<ReportPage />} />
                <Route path="system-settings" element={<SystemSettingsPage />} />
                <Route path="*"              element={<div>Admin Page Under Development</div>} />
              </Route>
            </Route>

            {/* ── Partner / Nhân viên cứu hộ ── */}
            <Route path="/partner/login" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
              <Route path="/partner" element={<StaffLayout />}>
                {/* UC-21: Trang chủ — đơn chờ + đang xử lý */}
                <Route index element={<StaffDashboard />} />

                {/* UC-22/23/24: Chi tiết + cập nhật trạng thái + hoàn thành */}
                <Route path="yeucau/:id" element={<StaffRequestDetail />} />

                {/* UC-25: Chat với khách hàng (có chatId) */}
                <Route path="chat/:id" element={<StaffChat />} />

                {/* UC-26: Lịch cứu hộ theo tháng */}
                <Route path="history" element={<StaffHistory />} />

                {/* UC-27: Cập nhật thông tin cá nhân */}
                <Route path="profile" element={<StaffProfile />} />

                {/* UC-28: Cập nhật dịch vụ cung cấp */}
                <Route path="services" element={<StaffServices />} />

                <Route path="*" element={<div>Staff Page Under Development</div>} />
              </Route>
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;