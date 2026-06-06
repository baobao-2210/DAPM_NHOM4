import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Star, User, Wrench, HelpCircle, Truck, DollarSign } from 'lucide-react';

const SidebarStaff = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/staff', icon: LayoutDashboard, exact: true },
    { name: 'Đơn mới', path: '/staff/pending-requests', icon: ClipboardList },
    { name: 'Đơn đang xử lý', path: '/staff/active-requests', icon: Truck },
    { name: 'Lịch sử cứu hộ', path: '/staff/history', icon: ClipboardList },
    { name: 'Đánh giá', path: '/staff/reviews', icon: Star },
    { name: 'Thu nhập', path: '/staff/income', icon: DollarSign },
    { name: 'Hồ sơ', path: '/staff/profile', icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-200 flex flex-col z-40">
      
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/staff" className="flex items-center gap-3 group">
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
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full transition-transform duration-300 ease-out origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Nút Hỗ trợ - Thay thế cho phần User Profile cũ */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link 
          to="/staff" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-all group border border-transparent hover:border-orange-100"
        >
          <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm">Hỗ trợ kỹ thuật</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarStaff;