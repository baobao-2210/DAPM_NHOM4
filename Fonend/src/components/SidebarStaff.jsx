import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LayoutDashboard, ClipboardList, LogOut, Truck, Star, User } from 'lucide-react';

const SidebarStaff = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Dashboard', path: '/staff', icon: LayoutDashboard },
    { name: 'Đơn được giao', path: '/staff/requests', icon: ClipboardList },
    { name: 'Đánh giá', path: '/staff/reviews', icon: Star },
    { name: 'Hồ sơ', path: '/staff/profile', icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-40">
      {/* Brand */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0F172A] tracking-tight">RescueCar</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">Nhân viên cứu hộ</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border-l-2 border-[#1D4ED8] pl-3'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8] font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0F172A] truncate">{user?.name || 'Staff'}</p>
            <p className="text-xs text-[#94A3B8] truncate">{user?.specialization || 'Tổng hợp'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm text-[#64748B] font-medium hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default SidebarStaff;
