import { Car, Wrench, Users, FileText, BarChart3, Settings, Bell, ChevronRight, LogOut, Shield, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

const navGroups = [
  {
    label: 'Tổng Quan',
    items: [
      { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
      { path: '/map', icon: MapPin, label: 'Bản Đồ Thực Tế' },
    ]
  },
  {
    label: 'Quản Lý',
    items: [
      { path: '/requests', icon: AlertTriangle, label: 'Yêu Cầu Cứu Hộ', badge: 7, badgeType: 'danger' },
      { path: '/staff', icon: Users, label: 'Nhân Viên' },
      { path: '/vehicles', icon: Car, label: 'Phương Tiện' },
      { path: '/services', icon: Wrench, label: 'Dịch Vụ' },
    ]
  },
  {
    label: 'Hệ Thống',
    items: [
      { path: '/reports', icon: FileText, label: 'Báo Cáo' },
      { path: '/users', icon: Shield, label: 'Tài Khoản' },
      { path: '/settings', icon: Settings, label: 'Cài Đặt' },
    ]
  }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const unread = mockNotifications.filter(n => !n.isRead).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Car size={20} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <h2>RescueVN</h2>
          <span>Hỗ Trợ Xe 24/7</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <div
                  key={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={16} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`nav-badge ${item.badgeType || ''}`}>{item.badge}</span>
                  )}
                  {isActive && !item.badge && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                </div>
              );
            })}
          </div>
        ))}

        {/* Notifications */}
        <div className="nav-section-label">Thông Báo</div>
        <div
          className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
          onClick={() => navigate('/notifications')}
        >
          <Bell size={16} />
          <span>Thông Báo</span>
          {unread > 0 && <span className="nav-badge">{unread}</span>}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" style={{ color: 'var(--danger)' }}>
          <LogOut size={16} />
          <span>Đăng Xuất</span>
        </div>
      </div>
    </aside>
  );
}
