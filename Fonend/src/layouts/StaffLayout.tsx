// src/layouts/StaffLayout.tsx
import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStaffData } from '../hooks/useStaffQueries';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

import { LayoutDashboard, BellRing, Activity, History, Star, DollarSign, User, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/partner',          label: 'Dashboard',         icon: LayoutDashboard, exact: true },
  { to: '/partner/pending',  label: 'Đơn mới',           icon: BellRing,        exact: false },
  { to: '/partner/active',   label: 'Đơn đang xử lý',    icon: Activity,        exact: false },
  { to: '/partner/history',  label: 'Lịch sử cứu hộ',    icon: History,         exact: false },
  { to: '/partner/reviews',  label: 'Đánh giá',          icon: Star,            exact: false },
  { to: '/partner/earnings', label: 'Thu nhập',          icon: DollarSign,      exact: false },
  { to: '/partner/profile',  label: 'Hồ sơ',             icon: User,            exact: false },
];

export default function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const { user, logout } = useAuth();
  const idTaiKhoan = user?.id ? parseInt(user.id) : 0; 

  const { staffInfo, pendingQuery, activeTaskQuery } = useStaffData();
  const pendingCount = pendingQuery.data?.length ?? 0;
  const hasActive    = !!activeTaskQuery.data;
  const isOnline     = staffInfo?.trangThaiNhanViec ?? false;

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', idTaiKhoan],
    queryFn: async () => {
      if (idTaiKhoan <= 0) return [];
      const res: any = await axiosClient.get(`/ThongBao/tai-khoan/${idTaiKhoan}`);
      const list = Array.isArray(res) ? res : [];
      return list.filter((n: any) => 
        !n.tieuDe?.toLowerCase().includes('đang đến') &&
        !n.tieuDe?.toLowerCase().includes('đang xử lý') &&
        !n.tieuDe?.toLowerCase().includes('cập nhật trạng thái')
      ).sort((a: any, b: any) => new Date(b.ngayTao || b.thoiGian).getTime() - new Date(a.ngayTao || a.thoiGian).getTime());
    },
    enabled: idTaiKhoan > 0,
    refetchInterval: 5000, 
  });

  const unreadCount = notifications.filter((n: any) => n.trangThai === 'ChuaDoc').length;

  const markAsReadMutation = useMutation({
    mutationFn: (idThongBao: number) => axiosClient.put(`/ThongBao/${idThongBao}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', idTaiKhoan] })
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => axiosClient.put(`/ThongBao/read-all/${idTaiKhoan}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', idTaiKhoan] })
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/partner') return 'Tổng quan nhiệm vụ';
    if (location.pathname.includes('/partner/messages')) return 'Tin nhắn & Hỗ trợ';
    if (location.pathname.includes('/partner/history')) return 'Lịch sử hoạt động';
    if (location.pathname.includes('/partner/services')) return 'Dịch vụ của tôi';
    if (location.pathname.includes('/partner/profile')) return 'Hồ sơ cá nhân';
    if (location.pathname.includes('/partner/yeucau')) return 'Chi tiết nhiệm vụ';
    if (location.pathname.includes('/partner/notifications')) return 'Tất cả thông báo';
    return 'RescueOps System';
  };

  const fmtTime = (d: string) => d ? new Date(d).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
      {/* ── SIDEBAR TRÁI ── */}
      <aside className="w-64 bg-[#1e3a8a] flex flex-col shrink-0 shadow-xl z-20 relative">
        <div className="px-6 py-6 border-b border-blue-800">
          <h1 className="text-white text-2xl font-black tracking-tight flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            RescueOps
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1 opacity-80 ">Hệ thống cứu hộ chuyên nghiệp</p>
        </div>

        <div className="px-6 py-5 border-b border-blue-800 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Trạng thái hoạt động</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.2)] ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span className={`text-[11px] font-semibold tracking-wide ${isOnline ? 'text-green-300' : 'text-gray-400'}`}>
                {isOnline ? 'Đang hoạt động' : 'Đang tạm nghỉ'}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-white text-[#1e3a8a] shadow-md' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#1e3a8a]' : 'text-blue-300'}><Icon /></span>
                  <span className="flex-1">{label}</span>
                  {to === '/partner/pending' && pendingCount > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white shadow-sm">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                  {to === '/partner/active' && hasActive && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                      1
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* NÚT HỖ TRỢ CUỐI MENU */}
        <div className="p-4 border-t border-blue-800">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-sm font-bold rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Trung tâm hỗ trợ
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-lg font-black text-gray-800 hidden md:block">{getPageTitle()}</h2>

          <div className="flex items-center gap-4">
            {/* NÚT THÔNG BÁO */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative border ${showNotif ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Thông báo ({unreadCount})</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} className="text-[11px] text-blue-600 font-bold hover:text-blue-800 transition-colors">Đánh dấu đã đọc</button>
                    )}
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-gray-500">Bạn không có thông báo nào</div>
                    ) : (
                      notifications.slice(0, 10).map((notif: any) => (
                        <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${notif.trangThai === 'ChuaDoc' ? 'bg-blue-50/40' : ''}`}>
                          <div className="mt-1 shrink-0">
                            <div className={`w-2.5 h-2.5 rounded-full ${notif.trangThai === 'ChuaDoc' ? 'bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.5)]' : 'bg-gray-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${notif.trangThai === 'ChuaDoc' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.tieuDe}</p>
                            <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${notif.trangThai === 'ChuaDoc' ? 'text-gray-700' : 'text-gray-500'}`}>{notif.noiDung}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">{fmtTime(notif.ngayTao || notif.thoiGian)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50">
                    <button onClick={() => { setShowNotif(false); navigate('/partner/notifications'); }} className="w-full py-2.5 text-sm text-blue-700 font-bold hover:bg-blue-100 rounded-xl transition-colors">Xem tất cả thông báo →</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 rounded-full transition-colors pr-3 border border-transparent hover:border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {staffInfo?.hoTen?.charAt(0) ?? 'N'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{staffInfo?.hoTen ?? 'Nhân viên'}</p>
                  <p className="text-[10px] font-semibold text-gray-500 leading-tight">Mã NV: #{staffInfo?.idNhanVien || '---'}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-1.5">
                  <div className="px-3 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-gray-900">{staffInfo?.hoTen ?? 'Nhân viên'}</p>
                    <p className="text-xs text-gray-500 font-medium truncate">{user?.email ?? 'Chưa cập nhật email'}</p>
                  </div>
                  
                  <button onClick={() => { navigate('/partner/profile'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Hồ sơ cá nhân
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                    Cài đặt
                  </button>

                  <div className="h-px bg-gray-100 my-1"></div>
                  
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function TaskIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function HistoryIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function ServiceIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>; }