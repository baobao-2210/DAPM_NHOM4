import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import SidebarStaff from '../components/SidebarStaff';
<<<<<<< HEAD
=======
import NotificationBell from '../components/ui/NotificationBell';
>>>>>>> admin-login
import { Menu, X, ChevronRight } from 'lucide-react';

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Generate breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbLabels = {
    staff: 'Nhân viên',
    requests: 'Đơn được giao',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-30 w-12 h-12 rounded-full bg-[#1D4ED8] text-white shadow-lg flex items-center justify-center hover:bg-[#1E40AF] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <SidebarStaff />
        {/* Mobile close button */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-[-48px] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main content area */}
      <div className="ml-0 md:ml-64 min-h-screen flex flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              {pathSegments.map((segment, index) => (
                <div key={segment} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />}
                  <span
                    className={
                      index === pathSegments.length - 1
                        ? 'font-semibold text-[#0F172A]'
                        : 'text-[#94A3B8]'
                    }
                  >
                    {breadcrumbLabels[segment] || segment}
                  </span>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            {/* User avatar */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#0F172A] leading-tight">{user?.name || 'Staff'}</p>
                <p className="text-xs text-[#94A3B8]">{user?.specialization || 'Nhân viên cứu hộ'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#1D4ED8]/20 flex items-center justify-center text-[#1D4ED8] font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
=======
            {/* Right section: Notifications & Avatar */}
            <div className="flex items-center gap-4">
              <NotificationBell />
              
              <div className="w-px h-6 bg-[#E2E8F0]"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[#0F172A] leading-tight">{user?.name || 'Staff'}</p>
                  <p className="text-xs text-[#94A3B8]">{user?.specialization || 'Nhân viên cứu hộ'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#1D4ED8]/20 flex items-center justify-center text-[#1D4ED8] font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
>>>>>>> admin-login
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
