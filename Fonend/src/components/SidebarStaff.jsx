import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LayoutDashboard, ClipboardList, LogOut, Truck, Star, User, Wrench } from 'lucide-react';

const SidebarStaff = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Thêm cờ `exact: true` cho Dashboard để chặn lỗi sáng 2 nút
  const navItems = [
    { name: 'Dashboard', path: '/staff', icon: LayoutDashboard, exact: true },
    { name: 'Đơn được giao', path: '/staff/requests', icon: ClipboardList },
    { name: 'Dịch vụ', path: '/staff/services', icon: Wrench },
    { name: 'Đánh giá', path: '/staff/reviews', icon: Star },
    { name: 'Hồ sơ', path: '/staff/profile', icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-200 flex flex-col z-40">
      
      {/* Brand Logo - Hiệu ứng Gradient bóng bẩy */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">Rescue<span className="text-blue-600">Car</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Quản lý điều phối</p>
        
        {navItems.map((item) => {
          // XỬ LÝ LỖI SÁNG 2 NÚT TẠI ĐÂY
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                isActive
                  ? 'text-blue-700 bg-blue-50/80 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {/* Thanh bar màu xanh trượt ra khi active */}
              <div 
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full transition-transform duration-300 ease-out origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} 
              />

              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section - Đóng gói vào một Card nhỏ */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-blue-700 font-black text-sm border border-blue-200/50 shadow-inner shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'N'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Nhân viên'}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">{user?.specialization || 'Cứu hộ viên'}</p>
            </div>
          </div>
        </div>
        
        {/* Nút Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all duration-300 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default SidebarStaff;