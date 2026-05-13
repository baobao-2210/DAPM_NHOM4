import { Bell, Search, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/map': 'Bản Đồ Cứu Hộ',
  '/admin/requests': 'Yêu Cầu Cứu Hộ',
  '/admin/staff': 'Quản Lý Nhân Viên',
  '/admin/vehicles': 'Phương Tiện',
  '/admin/services': 'Dịch Vụ Cứu Hộ',
  '/admin/reports': 'Báo Cáo & Thống Kê',
  '/admin/users': 'Tài Khoản Hệ Thống',
  '/admin/notifications': 'Thông Báo',
  '/admin/complaints': 'Khiếu Nại',
  '/admin/system-settings': 'Cài Đặt Hệ Thống',
};

interface HeaderProps { onMenuToggle?: () => void; }

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const unread = mockNotifications.filter(n => !n.isRead).length;
  const title = pageTitles[location.pathname] || 'RescueGuard';

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          className="lg:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#434654', padding: 6, borderRadius: 10 }}
          onClick={onMenuToggle}
        >
          <Menu size={22} />
        </button>
        <h1 className="admin-header-title">{title}</h1>
      </div>

      <div className="admin-header-actions">
        {/* Search */}
        <div className="admin-search-box hidden md:flex">
          <Search size={16} style={{ color: '#737686', flexShrink: 0 }} />
          <input placeholder="Tìm kiếm..." />
        </div>

        {/* Notifications */}
        <button
          className="admin-icon-btn"
          onClick={() => navigate('/admin/notifications')}
          title="Thông báo"
        >
          <Bell size={18} />
          {unread > 0 && <span className="admin-notif-dot" />}
        </button>

        {/* User */}
        <div className="admin-user-chip">
          <div className="admin-user-avatar">A</div>
          <div className="hidden sm:block" style={{ lineHeight: 1.2 }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#191c1e' }}>Admin</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#737686', textTransform: 'uppercase', letterSpacing: 1 }}>Hệ thống</p>
          </div>
        </div>
      </div>
    </header>
  );
}
