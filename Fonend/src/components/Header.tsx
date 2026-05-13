import { Bell, Search, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard Hệ Thống',
  '/admin/map': 'Bản Đồ Cứu Hộ',
  '/admin/requests': 'Quản Lý Yêu Cầu',
  '/admin/staff': 'Quản Lý Nhân Viên',
  '/admin/vehicles': 'Quản Lý Phương Tiện',
  '/admin/services': 'Dịch Vụ Cứu Hộ',
  '/admin/reports': 'Báo Cáo Thống Kê',
  '/admin/users': 'Quản Lý Tài Khoản',
  '/notifications': 'Thông Báo',
  '/settings': 'Cài Đặt',
};

interface HeaderProps { onMenuToggle?: () => void; }

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const unread = mockNotifications.filter(n => !n.isRead).length;
  const title = pageTitles[location.pathname] || 'RescueGuard';

  return (
    <header className="header border-b border-[var(--primary)]/10 shadow-sm">
      <div className="header-left flex items-center gap-4">

        <button className="p-2 -ml-2 lg:hidden text-[var(--text-sub)]" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-black text-[var(--text-main)]">{title}</h1>
      </div>

      <div className="header-right flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center gap-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-4 py-2.5 w-80 focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/5 transition-all">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input 
            placeholder="Tìm kiếm mọi thứ..." 
            className="bg-transparent border-0 outline-none text-sm w-full placeholder:text-[var(--text-muted)]"
          />
        </div>

        {/* Notifications */}
        <button
          className="p-3 bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl text-[var(--text-sub)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20 transition-all relative"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
          )}
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 pl-1 pr-4 py-1 bg-white border border-[var(--border)] rounded-full hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shadow-inner">
            A
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black text-[var(--text-main)] leading-none mb-0.5">Admin</p>
            <p className="text-[10px] text-[var(--text-muted)] leading-none font-bold uppercase tracking-wider">Hệ thống</p>
          </div>
        </button>
      </div>
    </header>
  );
}

