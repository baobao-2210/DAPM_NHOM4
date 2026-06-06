import React, { useState, useEffect } from 'react';
import { useStaffData, useStaffActions } from '../../hooks/useStaffQueries';
import { MapPin, Navigation, Car, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendingRequests() {
  const { staffInfo, pendingQuery, activeTaskQuery } = useStaffData();
  const actions = useStaffActions();
  const staffId = staffInfo?.idNhanVien ?? 0;

  // Local storage for ignored requests (Từ chối)
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`ignoredRequests_${staffId}`);
    if (saved) {
      try { setIgnoredIds(JSON.parse(saved)); } catch (e) {}
    }
  }, [staffId]);

  const handleIgnore = (id: number) => {
    const newIds = [...ignoredIds, id];
    setIgnoredIds(newIds);
    localStorage.setItem(`ignoredRequests_${staffId}`, JSON.stringify(newIds));
    toast.success('Đã từ chối và ẩn đơn này');
  };

  const handleAccept = (id: number) => {
    if (activeTaskQuery.data) {
      toast.error('Bạn đang có đơn chưa hoàn thành. Không thể nhận thêm!');
      return;
    }
    actions.accept.mutate(id);
  };

  const pendingTasks = Array.isArray(pendingQuery.data) 
    ? pendingQuery.data.filter(task => !ignoredIds.includes(task.id))
    : [];

  const fmt = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const fmtD = (d?: string) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1000px] mx-auto pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-xl"><ShieldCheck className="w-8 h-8 text-blue-600" /></span>
            Đơn Mới Chờ Nhận
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Danh sách các yêu cầu cứu hộ xung quanh bạn</p>
        </div>

        <div className="flex flex-col gap-6">
          {pendingQuery.isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-bold">Đang tải đơn mới...</p>
            </div>
          ) : pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
              <div key={task.id} className="bg-white rounded-[20px] shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Lệnh cứu hộ - Thông tin */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full uppercase tracking-wider mb-2 inline-block">Mã đơn: #{task.id}</span>
                        <h3 className="text-xl font-black text-gray-900">{task.tenDichVu}</h3>
                        <p className="text-blue-600 font-bold text-lg mt-1">{fmt(task.giaCoBan)}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{fmtD(task.ngayTao)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Khách hàng</p>
                          <p className="font-bold text-gray-900">{task.tenKhachHang}</p>
                          <p className="text-sm font-semibold text-gray-500">{task.soDienThoai}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                          <Car className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Xe gặp sự cố</p>
                          <p className="font-bold text-gray-900">{task.hangXe} {task.dongXe}</p>
                          <p className="text-sm font-semibold text-gray-500">{task.bienSo} {task.mauXe && `· ${task.mauXe}`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-50/50 rounded-xl border border-red-100 flex gap-3 items-start">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-800 uppercase mb-1">Mô tả sự cố</p>
                        <p className="text-sm text-red-900 font-medium leading-relaxed">{task.moTaSuCo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Map & Actions */}
                <div className="w-full md:w-[320px] bg-gray-50 flex flex-col border-l border-gray-100">
                  <div className="p-4 bg-gray-100 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Vị trí sự cố</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{task.noiSuCo}</p>
                    </div>
                  </div>
                  
                  {/* Bản đồ nhúng (Nếu có tọa độ) */}
                  <div className="flex-1 min-h-[160px] relative bg-gray-200">
                    {(task.viDo && task.kinhDo) ? (
                      <iframe
                        title="Vị trí sự cố"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${task.viDo},${task.kinhDo}&hl=vi&z=15&output=embed`}
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400 text-sm font-medium">Bản đồ không khả dụng</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex gap-3 bg-white">
                    <button
                      onClick={() => handleIgnore(task.id)}
                      className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleAccept(task.id)}
                      disabled={actions.accept.isPending}
                      className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 rounded-xl transition-all disabled:opacity-50"
                    >
                      {actions.accept.isPending ? 'Đang nhận...' : 'Nhận đơn'}
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <BellRing className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-900 font-black text-xl mb-2">Chưa có yêu cầu cứu hộ nào</p>
              <p className="text-gray-500 font-medium">Khi có khách hàng đặt đơn, đơn sẽ hiển thị ở đây.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
