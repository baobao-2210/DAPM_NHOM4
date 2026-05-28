import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Loading from '../../components/Loading';
import { Bell, CheckCircle, Clock, Truck, Info, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: 1, tieuDe: 'Đơn cứu hộ mới!', noiDung: 'Bạn vừa được phân công 1 đơn cứu hộ tại Quận 1. Vui lòng kiểm tra.', loai: 'HeThong', daDoc: false, thoiGian: new Date().toISOString() },
  { id: 2, tieuDe: 'Cập nhật hệ thống', noiDung: 'Hệ thống RescueCar sẽ bảo trì vào 00:00 đêm nay.', loai: 'TinTuc', daDoc: true, thoiGian: new Date(Date.now() - 86400000).toISOString() },
];

const StaffNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotis = async () => {
      try {
        const idTaiKhoan = user?._id || user?.id;
        if (!idTaiKhoan) return;
        const res = await axiosClient.get(`/ThongBao/${idTaiKhoan}`);
        setNotifications(res.data?.length > 0 ? res.data : MOCK_NOTIFICATIONS);
      } catch (err) {
        setNotifications(MOCK_NOTIFICATIONS); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchNotis();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      // await axiosClient.put(`/ThongBao/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, daDoc: true } : n));
    } catch (e) {
      toast.error("Lỗi cập nhật");
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, daDoc: true })));
    toast.success("Đã đánh dấu đọc tất cả");
  };

  const getIcon = (loai) => {
    switch(loai) {
      case 'HeThong': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'ThanhToan': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-orange-500" />;
    }
  };

  if (loading) return <Loading fullscreen={false} />;

  const unreadCount = notifications.filter(n => !n.daDoc).length;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Thông báo hệ thống" 
        description={`Bạn có ${unreadCount} thông báo chưa đọc.`} 
        actions={
          <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            <Check className="w-4 h-4" /> Đánh dấu đã đọc tất cả
          </button>
        }
      />

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-400">Không có thông báo nào.</div>
        ) : (
          notifications.map(noti => (
            <Card key={noti.id} padding={false} className={`overflow-hidden transition-colors ${noti.daDoc ? 'bg-white opacity-70' : 'bg-blue-50/30 border-blue-200'}`}>
              <div className="p-4 sm:p-5 flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${noti.daDoc ? 'bg-slate-100' : 'bg-blue-100 shadow-sm'}`}>
                  {getIcon(noti.loai)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className={`font-bold text-base ${noti.daDoc ? 'text-slate-700' : 'text-blue-900'}`}>{noti.tieuDe}</h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(noti.thoiGian).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{noti.noiDung}</p>
                  
                  {!noti.daDoc && (
                    <button onClick={() => markAsRead(noti.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                {!noti.daDoc && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 mt-2"></div>}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffNotifications;