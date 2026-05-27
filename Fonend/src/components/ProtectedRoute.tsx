import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Đang tải dữ liệu xác thực...</p>
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển về trang đăng nhập
  if (!isAuthenticated) {
    // Tùy theo route đang vào mà đẩy về login tương ứng (hoặc đẩy về chung 1 trang)
    const loginPath = location.pathname.startsWith('/partner') || location.pathname.startsWith('/admin') 
      ? '/partner/login' 
      : '/'; // Customer dùng chung popup Auth ở trang chủ, hoặc chuyển về /

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng không có quyền
  if (role && !allowedRoles.includes(role)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>403 - Không Có Quyền Truy Cập</h1>
        <p>Tài khoản của bạn không có quyền xem trang này.</p>
        <button 
          onClick={() => window.history.back()}
          style={{ padding: '8px 16px', background: '#003fb1', color: 'white', borderRadius: 8 }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Đủ quyền -> render component con
  return <Outlet />;
}
