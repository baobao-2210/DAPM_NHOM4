import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Car, ClipboardList, User, LogOut, Truck, Plus, Menu, X, Star, CreditCard, AlertTriangle } from 'lucide-react';

const CustomerLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Tổng quan', path: '/customer', icon: LayoutDashboard },
    { name: 'Hồ sơ cá nhân', path: '/customer/profile', icon: User },
    { name: 'Quản lý xe', path: '/customer/vehicles', icon: Car },
    { name: 'Lịch sử cứu hộ', path: '/customer/rescue-requests', icon: ClipboardList },
    { name: 'Thanh toán', path: '/customer/payments', icon: CreditCard },
    { name: 'Đánh giá', path: '/customer/reviews', icon: Star },
    { name: 'Khiếu nại', path: '/customer/complaints', icon: AlertTriangle },
  ];

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">RescueCar</span>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">Khách hàng</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border-l-2 border-[#1D4ED8] pl-3'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-3">
        <Link
          to="/customer/rescue-requests/create"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#FBBF24] text-[#0F172A] font-bold rounded-xl hover:bg-[#F59E0B] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Đặt cứu hộ
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm text-[#64748B] font-medium hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <div className="flex-grow flex pt-16">
        {/* Mobile sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-6 left-6 z-30 w-12 h-12 rounded-full bg-[#1D4ED8] text-white shadow-lg flex items-center justify-center hover:bg-[#1E40AF] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-grow min-w-0 ml-0 md:ml-64 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
