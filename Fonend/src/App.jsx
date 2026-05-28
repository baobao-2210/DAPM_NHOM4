import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Auth
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';

// Guest pages
import Home from './pages/guest/Home';
import Services from './pages/guest/Services';
import About from './pages/guest/About';
import Contact from './pages/guest/Contact';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Profile from './pages/customer/Profile';
import MyVehicles from './pages/customer/MyVehicles';
import CreateRescueRequest from './pages/customer/CreateRescueRequest';
import RescueRequestHistory from './pages/customer/RescueRequestHistory';
import RescueRequestDetail from './pages/customer/RescueRequestDetail';
import Reviews from './pages/customer/Reviews';
import Payments from './pages/customer/Payments';
import Complaints from './pages/customer/Complaints';
import LiveTracking from './pages/customer/LiveTracking';

// Staff pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AssignedRequests from './pages/staff/AssignedRequests';
import UpdateRequestStatus from './pages/staff/UpdateRequestStatus';
import StaffProfile from './pages/staff/StaffProfile';
import StaffReviews from './pages/staff/StaffReviews';
import StaffServices from './pages/staff/StaffServices'; // Nhớ trỏ đúng đường dẫn thư mục của bạn
import StaffNotifications from './pages/staff/StaffNotifications';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageStaff from './pages/admin/ManageStaff';
import ManageServices from './pages/admin/ManageServices';
import ManageRequests from './pages/admin/ManageRequests';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageAreas from './pages/admin/ManageAreas';
import StaffSpecialization from './pages/admin/StaffSpecialization';

// Shared pages
import Notifications from './pages/shared/Notifications';
import SharedChat from './pages/shared/SharedChat';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* === PUBLIC ROUTES (MainLayout) === */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* === CUSTOMER ROUTES === */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['customer']}>
                <CustomerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="rescue-requests" element={<RescueRequestHistory />} />
          <Route path="rescue-requests/create" element={<CreateRescueRequest />} />
          <Route path="rescue-requests/:id" element={<RescueRequestDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="payments" element={<Payments />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="tracking/:requestId" element={<LiveTracking />} />
          <Route path="chat/:requestId" element={<SharedChat />} />
        </Route>

        {/* === STAFF ROUTES === */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['staff']}>
                <StaffLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="requests" element={<AssignedRequests />} />
          <Route path="requests/:id" element={<UpdateRequestStatus />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="reviews" element={<StaffReviews />} />
          <Route path="services" element={<StaffServices />} />
          <Route path="notifications" element={<StaffNotifications />} />
          <Route path="chat/:requestId" element={<SharedChat />} />
        </Route>

        {/* === ADMIN ROUTES === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="staff/:id" element={<StaffSpecialization />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="areas" element={<ManageAreas />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
