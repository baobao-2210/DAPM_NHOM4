// src/pages/staff/Notifications.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const queryClient = useQueryClient();
  
  const { user } = useAuth();
  const idTaiKhoan = user?.id ? parseInt(user.id) : 0;

  const { data: notifications = [], isLoading } = useQuery({
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

  const markAsReadMutation = useMutation({
    mutationFn: (idThongBao: number) => axiosClient.put(`/ThongBao/${idThongBao}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', idTaiKhoan] })
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => axiosClient.put(`/ThongBao/read-all/${idTaiKhoan}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', idTaiKhoan] })
  });

  const handleMarkAsRead = (id: number, trangThai: string) => {
    if (trangThai === 'ChuaDoc') markAsReadMutation.mutate(id);
  };

  const displayNotifs = filter === 'unread' ? notifications.filter((n: any) => n.trangThai === 'ChuaDoc') : notifications;

  const fmtTime = (d: string) => d ? new Date(d).toLocaleString('vi-VN') : '';

  if (isLoading) return <div className="p-10 text-center text-gray-500">Đang tải thông báo...</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tất cả thông báo</h1>
          <p className="text-gray-500 font-medium mt-1">Quản lý toàn bộ thông báo từ hệ thống</p>
        </div>
        <button 
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={markAllAsReadMutation.isPending}
          className="px-5 py-2.5 bg-white border border-gray-200 text-blue-600 font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-6">
        <button onClick={() => setFilter('all')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
          Tất cả
        </button>
        <button onClick={() => setFilter('unread')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${filter === 'unread' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
          Chưa đọc ({notifications.filter((n:any) => n.trangThai === 'ChuaDoc').length})
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        {displayNotifs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-400"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <p className="text-gray-500 font-bold text-lg">Trống rỗng</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayNotifs.map((notif: any) => (
              <div 
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.trangThai)}
                className={`p-6 flex gap-4 cursor-pointer transition-colors ${notif.trangThai === 'ChuaDoc' ? 'bg-blue-50/20 hover:bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <div className="mt-1 shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notif.trangThai === 'ChuaDoc' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-base ${notif.trangThai === 'ChuaDoc' ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{notif.tieuDe}</p>
                    <span className="text-xs text-gray-400 font-bold tracking-wider">{fmtTime(notif.ngayTao || notif.thoiGian)}</span>
                  </div>
                  <p className={`mt-1.5 text-sm ${notif.trangThai === 'ChuaDoc' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{notif.noiDung}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}