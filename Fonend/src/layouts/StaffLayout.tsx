import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, MessageSquare, Settings, LogOut, Bell, User, AlertTriangle } from 'lucide-react';

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('partner_session');
    navigate('/partner/login', { replace: true });
  };

  const navItems = [
    { path: '/partner', icon: <MapPin size={20} />, label: 'Nhiệm vụ hiện tại' },
    { path: '/partner/history', icon: <Clock size={20} />, label: 'Lịch sử' },
    { path: '/partner/chat', icon: <MessageSquare size={20} />, label: 'Tin nhắn' },
    { path: '/partner/profile', icon: <Settings size={20} />, label: 'Cài đặt' },
  ];

  return (
    <div className="app-layout" style={{ background: '#F8FAFC', color: '#1E293B' }}>
      {/* SIDEBAR BÊN TRÁI */}
      <div className="sidebar" style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', width: 260 }}>
        <div className="sidebar-logo" style={{ padding: '24px 20px', borderBottom: 'none' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1E3A8A' }}>RescueOps</div>
        </div>
        <div className="sidebar-nav" style={{ padding: '10px 16px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8,
                marginBottom: 8, fontWeight: isActive ? 600 : 500,
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#1D4ED8' : '#64748B', textDecoration: 'none'
              }}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="sidebar-footer" style={{ padding: '20px 16px', borderTop: 'none', marginTop: 'auto' }}>
           <div className="flex items-center gap-3 mb-6 px-4">
             <div className="avatar-placeholder" style={{ width: 40, height: 40, background: '#F1F5F9', color: '#0F172A', borderRadius: '50%' }}>A</div>
             <div>
               <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Nhân viên #402</div>
               <div style={{ fontSize: 12, color: '#10B981' }}>● Đang hoạt động</div>
             </div>
           </div>
           <button className="btn w-full justify-center" style={{ background: '#1D4ED8', color: 'white', borderRadius: 8, padding: '12px' }}>
             <AlertTriangle size={16} /> Báo cáo sự cố
           </button>
           <button onClick={handleLogout} className="flex items-center gap-2 mt-4 text-sm font-medium w-full px-4" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
             <LogOut size={18} /> Đăng xuất
           </button>
        </div>
      </div>

      {/* HEADER & NỘI DUNG CHÍNH */}
      <div className="main-content" style={{ marginLeft: 260 }}>
        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'white', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Cập nhật trạng thái cứu hộ</div>
          <div className="flex items-center gap-4">
            <Bell size={20} color="#64748B" />
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 14, fontWeight: 500 }}>Nguyễn Văn An</span>
              <User size={32} color="#CBD5E1" />
            </div>
          </div>
        </header>
        <main style={{ padding: '24px 32px', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}