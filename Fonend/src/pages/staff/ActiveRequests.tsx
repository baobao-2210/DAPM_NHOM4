import React, { useState } from 'react';
import { useStaffData, useStaffActions } from '../../hooks/useStaffQueries';
import { MapPin, Navigation, Car, AlertTriangle, CheckCircle, User, Phone, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import { SubStatus } from '../../api/staffApi';

export default function ActiveRequests() {
  const { staffInfo, activeTaskQuery } = useStaffData();
  const actions = useStaffActions();
  const task = activeTaskQuery.data;

  const [chiPhi, setChiPhi] = useState<string>('');

  if (activeTaskQuery.isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-[1000px] mx-auto pb-10">
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-900 font-black text-xl mb-2">Bạn đang rảnh rỗi</p>
            <p className="text-gray-500 font-medium">Hiện không có đơn nào đang được xử lý.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: SubStatus) => {
    actions.updateStatus.mutate({ 
      id: task.id, 
      trangThai: newStatus, 
      ghiChu: `Cập nhật trạng thái: ${newStatus}` 
    });
  };

  const handleComplete = () => {
    const val = parseInt(chiPhi.replace(/\D/g, ''));
    if (!val || val < 0) {
      toast.error('Vui lòng nhập chi phí hợp lệ!');
      return;
    }
    actions.complete.mutate({ id: task.id, chiPhiThucTe: val });
  };

  const fmt = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const currentStep = task.subStatus || task.trangThaiHienTai;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1000px] mx-auto pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-xl"><Car className="w-8 h-8 text-blue-600" /></span>
            Đơn Đang Xử Lý #{task.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* THÔNG TIN KHÁCH HÀNG & XE */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                Thông tin chung
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Khách hàng</p>
                    <p className="text-lg font-black text-gray-900">{task.tenKhachHang}</p>
                    <p className="font-semibold text-gray-600">{task.soDienThoai}</p>
                    <a href={`tel:${task.soDienThoai}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800">
                      <Phone className="w-4 h-4" /> Gọi điện ngay
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Car className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Phương tiện</p>
                    <p className="text-lg font-black text-gray-900">{task.hangXe} {task.dongXe}</p>
                    <p className="font-semibold text-gray-600">{task.bienSo} {task.mauXe && `· ${task.mauXe}`}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Dịch vụ yêu cầu</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-black text-gray-900">{task.tenDichVu}</p>
                  <p className="text-xl font-black text-blue-600">{fmt(task.giaCoBan)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-800 uppercase mb-1">Mô tả sự cố</p>
                  <p className="text-sm text-red-900 font-medium leading-relaxed">{task.moTaSuCo}</p>
                </div>
              </div>
            </div>

            {/* BẢN ĐỒ VỊ TRÍ */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 overflow-hidden">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Vị trí sự cố
              </h3>
              <p className="text-gray-800 font-medium mb-4">{task.noiSuCo}</p>
              
              <div className="h-[250px] w-full rounded-xl overflow-hidden bg-gray-200 relative mb-4">
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
                    <p className="text-gray-500 font-medium">Bản đồ không khả dụng</p>
                  </div>
                )}
              </div>
              
              <a 
                href={(task.viDo && task.kinhDo) ? `https://www.google.com/maps/dir/?api=1&destination=${task.viDo},${task.kinhDo}` : '#'} 
                target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Map className="w-5 h-5" />
                Chỉ đường qua Google Maps
              </a>
            </div>

          </div>

          {/* CỘT PHẢI: STEPPER TRẠNG THÁI */}
          <div className="space-y-6">
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-6">Cập nhật tiến trình</h3>
              
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                
                <StatusStep 
                  title="Đã nhận đơn" 
                  isActive={currentStep === 'DaNhan'} 
                  isPast={['DangDen', 'DaDen', 'DangSua', 'HoanThanh'].includes(currentStep)}
                  onActivate={() => handleUpdateStatus('DaNhan')}
                  isLoading={actions.updateStatus.isPending}
                />
                
                <StatusStep 
                  title="Đang di chuyển" 
                  isActive={currentStep === 'DangDen'} 
                  isPast={['DaDen', 'DangSua', 'HoanThanh'].includes(currentStep)}
                  onActivate={() => handleUpdateStatus('DangDen')}
                  isLoading={actions.updateStatus.isPending}
                />

                <StatusStep 
                  title="Đã đến nơi" 
                  isActive={currentStep === 'DaDen'} 
                  isPast={['DangSua', 'HoanThanh'].includes(currentStep)}
                  onActivate={() => handleUpdateStatus('DaDen')}
                  isLoading={actions.updateStatus.isPending}
                />

                <StatusStep 
                  title="Đang sửa chữa" 
                  isActive={currentStep === 'DangSua'} 
                  isPast={['HoanThanh'].includes(currentStep)}
                  onActivate={() => handleUpdateStatus('DangSua')}
                  isLoading={actions.updateStatus.isPending}
                />

              </div>

              {currentStep === 'DangSua' && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Hoàn thành cứu hộ</h4>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chi phí thực tế (VND)</label>
                    <input 
                      type="text" 
                      value={chiPhi}
                      onChange={(e) => setChiPhi(e.target.value)}
                      placeholder="Nhập số tiền..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleComplete}
                    disabled={actions.complete.isPending}
                    className="w-full py-4 text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {actions.complete.isPending ? 'Đang xử lý...' : 'Hoàn thành chuyến'}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatusStep({ title, isActive, isPast, onActivate, isLoading }: any) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors
        ${isActive ? 'bg-blue-600 border-blue-100 text-white' : isPast ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
        {isPast ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm transition-all text-left md:text-right group-odd:text-left">
        <h4 className={`font-bold text-sm ${isActive ? 'text-blue-700' : isPast ? 'text-green-700' : 'text-gray-500'}`}>{title}</h4>
        {(!isPast && !isActive) && (
          <button 
            onClick={onActivate} 
            disabled={isLoading}
            className="mt-2 text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full text-center"
          >
            Cập nhật
          </button>
        )}
      </div>
    </div>
  );
}
