import { Navigate, Outlet } from 'react-router-dom';

/**
 * Bảo vệ các route của nhân viên cứu hộ.
 * Nếu chưa đăng nhập → redirect về /partner/login
 */
export default function StaffPrivateRoute() {
  const session = localStorage.getItem('partner_session');
  if (!session) {
    return <Navigate to="/partner/login" replace />;
  }
  return <Outlet />;
}
