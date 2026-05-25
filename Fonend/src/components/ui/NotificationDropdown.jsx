import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import Badge from './Badge';

const mockNotifications = [
  { id: 1, title: 'Đơn cứu hộ đã được nhận', message: 'Nhân viên Nguyễn Văn A đang trên đường đến.', type: 'info', isRead: false, time: '5 phút trước' },
  { id: 2, title: 'Thanh toán thành công', message: 'Bạn đã thanh toán 250,000đ cho đơn cứu hộ #1234.', type: 'success', isRead: false, time: '1 giờ trước' },
  { id: 3, title: 'Cảnh báo hệ thống', message: 'Hệ thống sẽ bảo trì vào lúc 00:00 ngày mai.', type: 'warning', isRead: true, time: '1 ngày trước' },
];

const iconMap = {
  info: <Info className="w-5 h-5 text-[#3B82F6]" />,
  success: <CheckCircle className="w-5 h-5 text-[#22C55E]" />,
  warning: <AlertCircle className="w-5 h-5 text-[#F59E0B]" />,
};

const bgMap = {
  info: 'bg-[#EFF6FF]',
  success: 'bg-[#F0FDF4]',
  warning: 'bg-[#FFFBEB]',
};

const NotificationDropdown = ({ basePath = '/customer/notifications' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
      >
        <Bell className="w-6 h-6 text-[#64748B]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#EF4444] text-[10px] font-bold text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] z-50 overflow-hidden origin-top-right animate-[scaleIn_0.2s_ease-out]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="font-bold text-[#0F172A]">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#64748B]">
                <Bell className="w-12 h-12 mx-auto mb-2 text-[#E2E8F0]" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-3 ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgMap[notification.type]}`}>
                      {iconMap[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-0.5 ${!notification.isRead ? 'font-bold text-[#0F172A]' : 'font-medium text-[#0F172A]'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-[#64748B] line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notification.time}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#1D4ED8] self-center flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <Link
              to={basePath}
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-sm font-semibold text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-xl transition-colors"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
