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
      { path: '/admin/requests', icon: AlertTriangle, label: 'Yêu Cầu Cứu Hộ', badge: 7, badgeType: 'danger' },
      { path: '/admin/staff', icon: Users, label: 'Nhân Viên' },
      { path: '/admin/vehicles', icon: Car, label: 'Phương Tiện' },
      { path: '/admin/services', icon: Wrench, label: 'Dịch Vụ' },
      { path: '/admin/complaints', icon: MessageSquare, label: 'Khiếu Nại', badge: 2, badgeType: 'danger' },
    ]
  },
  {
    label: 'Hệ Thống',
    items: [
      { path: '/admin/users', icon: Shield, label: 'Tài Khoản' },
      { path: '/admin/reports', icon: FileText, label: 'Báo Cáo & Thống Kê' },
      { path: '/admin/notifications', icon: Bell, label: 'Thông Báo', badge: 3, badgeType: 'primary' },
      { path: '/admin/system-settings', icon: Settings, label: 'Cài Đặt Hệ Thống' },
    ]
  }
];



interface SidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export default function Sidebar({ onClose, isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/partner/login', { replace: true });
  };

  return (
    <aside className={`${isOpen ? 'mobile-open' : ''} sidebar`}>

      <div className="sidebar-logo py-8 px-8 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <Car size={24} color="white" />
          </div>
          <div className="sidebar-logo-text ml-4">
            <h2 className="text-xl font-black text-[var(--primary)] leading-tight">RescueGuard</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Partner Portal</span>
          </div>
        </div>
        <button className="lg:hidden p-2 text-[var(--text-muted)]" onClick={onClose}>
          <X size={20} />
        </button>
      </div>


      <nav className="sidebar-nav flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map(group => (
          <div key={group.label} className="space-y-1">
            <div className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
              {group.label}
            </div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <div
                  key={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all group relative overflow-hidden ${
                    isActive 
                    ? 'nav-item-active' 
                    : 'text-[var(--text-sub)] hover:bg-[var(--primary)]/[0.04] hover:text-[var(--primary)]'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={18} className={isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'} />
                  <span className="text-sm">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeType === 'danger' ? 'bg-red-100 text-red-600' : 'bg-[var(--primary)] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
                </div>
              );
            })}

          </div>
        ))}


      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all cursor-pointer">
          <LogOut size={18} />
          <span className="text-sm">Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}

