import { Car, Wrench, Users, FileText, BarChart3, Settings, Bell, LogOut, Shield, MapPin, AlertTriangle, X, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navGroups = [
  {
    label: 'Tổng Quan',
    items: [
      { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
      { path: '/admin/map', icon: MapPin, label: 'Bản Đồ Thực Tế' },
    ]
  },
  {
    label: 'Quản Lý',
    items: [
      { path: '/admin/requests', icon: AlertTriangle, label: 'Yêu Cầu Cứu Hộ', badge: 7, badgeCls: '' },
      { path: '/admin/staff', icon: Users, label: 'Nhân Viên' },
      { path: '/admin/vehicles', icon: Car, label: 'Phương Tiện' },
      { path: '/admin/services', icon: Wrench, label: 'Dịch Vụ' },
      { path: '/admin/complaints', icon: MessageSquare, label: 'Khiếu Nại', badge: 2, badgeCls: '' },
    ]
  },
  {
    label: 'Hệ Thống',
    items: [
      { path: '/admin/users', icon: Shield, label: 'Tài Khoản' },
      { path: '/admin/reports', icon: FileText, label: 'Báo Cáo & Thống Kê' },
      { path: '/admin/notifications', icon: Bell, label: 'Thông Báo', badge: 3, badgeCls: 'accent' },
      { path: '/admin/system-settings', icon: Settings, label: 'Cài Đặt Hệ Thống' },
    ]
  }
];

interface SidebarProps { onClose?: () => void; isOpen?: boolean; }

export default function Sidebar({ onClose, isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/partner/login', { replace: true }); };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>

      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="admin-logo-icon">
            <Car size={22} />
          </div>
          <div className="admin-logo-text">
            <h2>RescueGuard</h2>
            <span>Admin Portal</span>
          </div>
        </div>
        <button
          className="lg:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 6 }}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="admin-sidebar-nav">
        {navGroups.map(group => (
          <div key={group.label} className="admin-nav-group">
            <div className="admin-nav-group-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <div
                  key={item.path}
                  className={`admin-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="nav-icon">
                    <Icon size={17} />
                  </div>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`admin-nav-badge ${item.badgeCls || ''}`}>{item.badge}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}
