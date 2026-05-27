import { useState, useEffect, useRef } from 'react';
import { Bell, Check, BellOff, CheckCircle2 } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = () => {
    if (!user?._id) return;
    notificationApi.getByUserId(user._id)
      .then(res => setNotifications(res.data || []))
      .catch(err => console.error("Lỗi tải thông báo:", err));
  };

  useEffect(() => {
    fetchNotifications();
    // Đóng dropdown khi click bên ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user?._id]);

  const unreadCount = notifications.filter(n => n.trangThai === 'ChuaDoc').length;

  const handleMarkAsRead = async (id, e) => {
    if(e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, trangThai: 'DaDoc' } : n));
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleMarkAllAsRead = async () => {
    if(unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead(user._id);
      setNotifications(prev => prev.map(n => ({ ...n, trangThai: 'DaDoc' })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Chuông */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] rounded-full transition-colors"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-50">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
              Thông báo {unreadCount > 0 && <span className="bg-[#1D4ED8] text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} mới</span>}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#1D4ED8] hover:underline font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Đánh dấu đã đọc
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-[#94A3B8]">
                <BellOff className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Không có thông báo nào</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#F1F5F9]">
                {notifications.map(notif => (
                  <li 
                    key={notif.id} 
                    className={`p-4 hover:bg-[#F8FAFC] transition-colors flex gap-3 cursor-pointer ${notif.trangThai === 'ChuaDoc' ? 'bg-[#EFF6FF]/50' : 'opacity-80'}`}
                    onClick={() => {
                      if(notif.trangThai === 'ChuaDoc') handleMarkAsRead(notif.id);
                    }}
                  >
                    <div className="flex-1">
                      <p className={`text-sm ${notif.trangThai === 'ChuaDoc' ? 'font-semibold text-[#0F172A]' : 'text-[#334155]'}`}>
                        {notif.tieuDe}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                        {notif.noiDung}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-2 font-medium">
                        {new Date(notif.ngayTao).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {notif.trangThai === 'ChuaDoc' && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="text-[#94A3B8] hover:text-[#1D4ED8] p-1"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
