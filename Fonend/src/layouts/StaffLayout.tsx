// src/layouts/StaffLayout.tsx
// Theo demo: sidebar trái, màu xanh navy, clean professional
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStaffData } from '../hooks/useStaffQueries';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/partner',          label: 'Nhiệm vụ',      icon: TaskIcon,    exact: true },
  { to: '/partner/history',  label: 'Lịch sử',       icon: HistoryIcon, exact: false },
  { to: '/partner/profile',  label: 'Hồ sơ cá nhân', icon: ProfileIcon, exact: false },
  { to: '/partner/services', label: 'Dịch vụ của tôi',icon: ServiceIcon, exact: false },
];

// SVG icon components
function TaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

export default function StaffLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { staffInfo, pendingQuery, activeTaskQuery } = useStaffData();

  const pendingCount = pendingQuery.data?.length ?? 0;
  const hasActive    = !!activeTaskQuery.data;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#1e3a8a] flex flex-col shrink-0 shadow-xl">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-blue-800">
          <h1 className="text-white text-xl font-bold tracking-tight">RescueOps</h1>
          <p className="text-blue-300 text-xs mt-0.5">Hệ thống cứu hộ chuyên nghiệp</p>
        </div>

        {/* Staff info */}
        <div className="px-4 py-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {staffInfo?.hoTen?.charAt(0) ?? 'N'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {staffInfo?.hoTen ?? 'Nhân viên'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${staffInfo?.trangThaiNhanViec ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-blue-300 text-xs">
                  {staffInfo?.trangThaiNhanViec ? 'Đang hoạt động' : 'Tạm nghỉ'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#1e3a8a]' : 'text-blue-300'}>
                    <Icon />
                  </span>
                  <span className="flex-1">{label}</span>
                  {/* Badge */}
                  {to === '/partner' && (pendingCount > 0 || hasActive) && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      hasActive ? 'bg-yellow-400 text-yellow-900' : 'bg-red-500 text-white'
                    }`}>
                      {hasActive ? '!' : pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: stats + logout */}
        <div className="px-4 py-4 border-t border-blue-800 space-y-3">
          {/* Rating */}
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span>Điểm đánh giá</span>
            <span className="text-yellow-400 font-bold">
              ★ {(staffInfo?.diemTb ?? 0).toFixed(1)}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-blue-300 hover:text-white hover:bg-blue-800 rounded-lg text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}