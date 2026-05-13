import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, MessageSquare, Settings, LogOut, Bell, User, AlertTriangle, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/partner/login', { replace: true });
  };

  const navItems = [
    { path: '/partner', icon: <MapPin size={20} />, label: 'Nhiệm vụ hiện tại' },
    { path: '/partner/history', icon: <Clock size={20} />, label: 'Lịch sử' },
    { path: '/partner/chat', icon: <MessageSquare size={20} />, label: 'Tin nhắn' },
    { path: '/partner/profile', icon: <Settings size={20} />, label: 'Cài đặt' },
  ];

  return (
    <div className="app-layout">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="sidebar">
        <div className="sidebar-logo py-8 px-8 border-b border-[var(--border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <Car size={24} color="white" />
          </div>
          <div className="sidebar-logo-text ml-4">
            <h2 className="text-xl font-black text-[var(--primary)] leading-tight">RescueOps</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Staff Dashboard</span>
          </div>
        </div>
        
        <nav className="sidebar-nav flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                  isActive 
                  ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-bold' 
                  : 'text-[var(--text-sub)] hover:bg-[var(--bg-body)]'
                }`}
                style={{ textDecoration: 'none' }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--border)] mt-auto space-y-6">
           <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-[var(--bg-body)] text-[var(--text-main)] flex items-center justify-center font-bold border border-[var(--border)]">A</div>
             <div>
               <p className="text-sm font-black text-[var(--text-main)] leading-none mb-1">Nhân viên #402</p>
               <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                 Đang hoạt động
               </p>
             </div>
           </div>
           <button className="btn btn-primary w-full py-4 rounded-2xl">
             <AlertTriangle size={18} /> 
             <span className="text-sm">Báo cáo sự cố</span>
           </button>
           <button 
             onClick={handleLogout} 
             className="flex items-center gap-2 px-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer w-full"
           >
             <LogOut size={18} /> Đăng xuất
           </button>
        </div>
      </aside>

      {/* HEADER & NỘI DUNG CHÍNH */}
      <div className="main-content">
        <header className="header px-10">
          <h2 className="text-xl font-black text-[var(--text-main)]">Cập nhật trạng thái cứu hộ</h2>
          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-[var(--bg-body)] rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] transition-all">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[var(--text-main)]">Nguyễn Văn An</span>
              <div className="w-9 h-9 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold border border-[var(--primary)]/10">
                NV
              </div>
            </div>
          </div>
        </header>
        <main className="page-content bg-white/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}