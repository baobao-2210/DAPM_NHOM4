import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { Bell, Info, CheckCircle, AlertCircle, Trash2, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Đơn cứu hộ đã được nhận', message: 'Nhân viên Nguyễn Văn A đang trên đường đến. Vui lòng giữ điện thoại để liên lạc.', type: 'info', isRead: false, time: '5 phút trước' },
  { id: 2, title: 'Thanh toán thành công', message: 'Bạn đã thanh toán 250,000đ cho đơn cứu hộ #1234 qua VNPay.', type: 'success', isRead: false, time: '1 giờ trước' },
  { id: 3, title: 'Cảnh báo hệ thống', message: 'Hệ thống sẽ bảo trì từ 00:00 đến 02:00 ngày mai. Vui lòng lưu ý.', type: 'warning', isRead: true, time: '1 ngày trước' },
  { id: 4, title: 'Đơn cứu hộ hoàn thành', message: 'Đơn cứu hộ #1233 đã hoàn thành. Hãy đánh giá dịch vụ của chúng tôi.', type: 'success', isRead: true, time: '2 ngày trước' },
  { id: 5, title: 'Đăng ký thành công', message: 'Chào mừng bạn đến với hệ thống RescueCar.', type: 'info', isRead: true, time: '3 ngày trước' },
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

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Đã xóa thông báo');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Trung tâm thông báo"
        description={`Bạn có ${unreadCount} thông báo chưa đọc`}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              icon={Check}
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          ) : null
        }
      />

      <Card padding={false} className="overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Bell}
              title="Không có thông báo"
              description="Hiện tại bạn không có thông báo nào trong hệ thống."
            />
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-6 ${
                  !notification.isRead ? 'bg-blue-50/50' : 'hover:bg-[#F8FAFC]'
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgMap[notification.type]}`}>
                  {iconMap[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-base mb-1 ${!notification.isRead ? 'font-bold text-[#0F172A]' : 'font-semibold text-[#0F172A]'}`}>
                        {notification.title}
                        {!notification.isRead && (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#1D4ED8] ml-2 align-middle" />
                        )}
                      </h3>
                      <p className="text-sm text-[#64748B] leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                        className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
