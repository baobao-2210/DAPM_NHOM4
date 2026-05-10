import { Bell, Search, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/map': 'Bản Đồ Thực Tế',
  '/requests': 'Quản Lý Yêu Cầu Cứu Hộ',
  '/staff': 'Quản Lý Nhân Viên',
  '/vehicles': 'Quản Lý Phương Tiện',
  '/services': 'Gói Dịch Vụ',
  '/reports': 'Báo Cáo & Thống Kê',
  '/users': 'Quản Lý Tài Khoản',
  '/notifications': 'Thông Báo',
  '/settings': 'Cài Đặt Hệ Thống',
};

interface HeaderProps { onMenuToggle?: () => void; }

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const unread = mockNotifications.filter(n => !n.isRead).length;
  const title = pageTitles[location.pathname] || 'RescueVN';

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-ghost btn-icon" onClick={onMenuToggle} style={{ display: 'none' }}>
          <Menu size={18} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="search-bar" style={{ minWidth: 220 }}>
          <Search size={15} />
          <input placeholder="Tìm kiếm..." />
        </div>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-icon"
          style={{ position: 'relative' }}
          onClick={() => navigate('/notifications')}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--danger)',
              boxShadow: '0 0 6px rgba(239,68,68,0.8)'
            }} />
          )}
        </button>

        {/* User Menu */}
        <button className="btn btn-secondary" style={{ gap: 8 }}>
          <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 11 }}>A</div>
          <span style={{ fontSize: 13 }}>Admin</span>
        </button>
      </div>
    </header>
  );
}
