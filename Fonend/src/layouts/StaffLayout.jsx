import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axiosClient from '../api/axiosClient';
import { Bell, ChevronDown, Circle, Power, User } from 'lucide-react';
import SidebarStaff from '../components/SidebarStaff';
import toast from 'react-hot-toast';

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Trạng thái làm việc thực tế
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm gạt đổi trạng thái
  const toggleStatus = async () => {
    try {
      const nextStatus = !isOnline;
      // Khi nào có API thật của C# thì mở dòng dưới ra nhé:
      // await axiosClient.put(`/NhanVien/${user?.staffId}/status`, { status: nextStatus });
      setIsOnline(nextStatus);
      toast.success(nextStatus ? 'Bạn đã sẵn sàng nhận đơn!' : 'Đã chuyển sang trạng thái nghỉ.');
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarStaff />
      
      <div className="pl-64">
        {/* HEADER XỊN XÒ - ĐÃ THÊM ĐÈN HIỂN THỊ TRẠNG THÁI */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            Nhân viên <span className="text-slate-300">/</span> <span className="text-slate-800">Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <Link to="/staff/notifications" className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            {/* Cụm nút bấm Profile & Trạng thái */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all"
              >
                {/* 1. HIỂN THỊ CHỮ TRẠNG THÁI NGAY BÊN NGOÀI */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.hoTen || user?.name || 'Trần Cứu Hộ'}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1 ${
                    isOnline ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                    {isOnline ? 'Sẵn sàng' : 'Tạm nghỉ'}
                  </span>
                </div>

                {/* 2. AVATAR CÓ CHẤM ĐÈN LED NỔI (Style Facebook/Discord) */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm border-2 border-white shadow-sm select-none">
                    {user?.hoTen?.charAt(0) || user?.name?.charAt(0) || 'T'}
                  </div>
                  {/* Chấm tròn bo viền trạng thái */}
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white shadow-sm transition-colors duration-300 ${
                    isOnline ? 'bg-green-500' : 'bg-slate-400'
                  }`} />
                </div>
                
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* KHUNG MENU THẢ XUỐNG KHI CLICK */}
              {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 animate-in fade-in zoom-in duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Cấu hình trạng thái</p>
                    <button 
                      onClick={toggleStatus}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Circle className={`w-2 h-2 fill-current ${isOnline ? 'text-green-500' : 'text-slate-400'}`} />
                        {isOnline ? 'Đang sẵn sàng' : 'Đang bận'}
                      </div>
                      {/* Công tắc gạt gạt */}
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${isOnline ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </button>
                  </div>

                  <div className="px-2">
                    <Link to="/staff/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4 text-slate-400" /> Hồ sơ cá nhân
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Power className="w-4 h-4" /> Đăng xuất hệ thống
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;