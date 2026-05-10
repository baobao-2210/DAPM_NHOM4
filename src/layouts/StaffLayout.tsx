import { Outlet, useLocation, Link } from 'react-router-dom';
import { MapPin, Clock, User, MessageCircle, ShieldAlert, LogOut } from 'lucide-react';

export default function StaffLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/partner', icon: <MapPin size={20} />, label: 'Trực Ban' },
    { path: '/partner/chat', icon: <MessageCircle size={20} />, label: 'Tin Nhắn' },
    { path: '/partner/history', icon: <Clock size={20} />, label: 'Lịch Sử' },
    { path: '/partner/profile', icon: <User size={20} />, label: 'Tài Khoản' },
  ];

  return (
    <div className="app-layout">
      {/* SIDEBAR BÊN TRÁI (PC) */}
      <div className="sidebar" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><ShieldAlert color="white" size={24} /></div>
          <div className="sidebar-logo-text">
            <h2>Kênh Đối Tác</h2>
            <span>RescueVN</span>
          </div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Menu Nhân Viên</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <div className="nav-icon">{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="sidebar-footer">
           <button className="nav-item w-full" style={{ border: 'none', background: 'none' }}>
             <LogOut size={20} /> <span>Đăng xuất</span>
           </button>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="main-content" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <main className="page-content animate-fade-in" style={{ padding: '24px', paddingTop: '24px', height: '100vh', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* BOTTOM NAV (MOBILE) */}
      <div className="staff-bottom-nav">
        <style>{`
          @media (min-width: 769px) { .staff-bottom-nav { display: none; } }
          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0 !important; }
            .page-content { padding-bottom: 90px !important; }
            .staff-bottom-nav {
              position: fixed; bottom: 0; left: 0; right: 0; height: 70px;
              background: rgba(19, 22, 30, 0.95); backdrop-filter: blur(10px);
              border-top: 1px solid var(--border); display: flex; justify-content: space-around; align-items: center; z-index: 1000;
            }
          }
        `}</style>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)', textDecoration: 'none', width: '25%', padding: '8px 0'
            }}>
              <div style={{
                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent', transition: 'var(--transition)'
              }}>{item.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}