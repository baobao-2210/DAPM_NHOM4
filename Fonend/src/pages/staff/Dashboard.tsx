import { useState } from 'react';
import { MapPin, Phone, MessageSquare, Send, User, AlertCircle, Clock, Navigation, CheckCircle2, ChevronRight, FileText, BadgeDollarSign } from 'lucide-react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function StaffDashboard() {
  const { activeTaskQuery, pendingQuery, actions } = useStaffData();
  const [view, setView] = useState<'tracking' | 'invoice'>('tracking');
  const [invoiceNote, setInvoiceNote] = useState('');
  const [finalCost, setFinalCost] = useState(560000);

  const activeRequest = activeTaskQuery.data;
  const pendingList = pendingQuery.data || [];

  if (activeTaskQuery.isLoading || pendingQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-[var(--text-muted)]">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold uppercase tracking-widest text-xs">Đang đồng bộ dữ liệu hệ thống...</p>
      </div>
    );
  }

  // ================= CHẾ ĐỘ 1: KHI ĐANG RẢNH - CHỜ NHẬN ĐƠN =================
  if (!activeRequest) {
    if (pendingList.length === 0) {
      return (
        <div className="animate-fade-in max-w-4xl mx-auto py-12">
          <div className="card p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-[var(--primary)] to-purple-500"></div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative z-10 mb-6 border-4 border-white shadow-lg">
                <Navigation size={40} className="text-[var(--primary)]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-[var(--text-main)] mb-3 tracking-tight">Sẵn sàng nhận nhiệm vụ</h2>
            <p className="text-[var(--text-sub)] max-w-md mx-auto mb-8 font-medium">Hệ thống đang quét các sự cố xung quanh khu vực của bạn. Vui lòng giữ ứng dụng mở và kết nối mạng ổn định.</p>
            
            <div className="bg-[var(--bg-body)] px-6 py-4 rounded-2xl border border-[var(--border)] flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-[var(--text-main)]">Trạng thái: Đang trực tuyến</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-500">
              <AlertCircle size={14} /> <span>Yêu cầu khẩn cấp</span>
            </div>
            <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Yêu Cầu Đang Chờ</h1>
            <p className="text-[var(--text-sub)] max-w-2xl font-medium">Có {pendingList.length} yêu cầu cứu hộ xung quanh bạn. Hãy tiếp nhận ngay.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingList.map((req: any) => (
            <div key={req.id} className="card p-0 overflow-hidden hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-700">
                    <Clock size={12} className="mr-1.5" /> Chờ xử lý
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-[var(--text-main)] mb-1">{req.loaiSuCo || 'Sự cố khẩn cấp'}</h3>
                <div className="text-sm font-bold text-[var(--primary)] mb-6 flex items-center gap-1.5">
                  <User size={14} /> Khách hàng: {req.tenKhachHang || 'Khách vãng lai'}
                </div>
                
                <div className="flex items-start gap-2.5 text-[var(--text-sub)] bg-[var(--bg-body)] p-3.5 rounded-2xl border border-[var(--border)]">
                  <MapPin size={18} className="text-[var(--primary)] flex-shrink-0 mt-0.5" /> 
                  <span className="font-medium text-sm leading-relaxed">{req.diaChi || 'Không rõ địa chỉ'}</span>
                </div>
              </div>
              
              <div className="p-4 bg-[var(--bg-body)] border-t border-[var(--border)]">
                <button 
                  onClick={() => actions.accept.mutate(req.id)}
                  disabled={actions.accept.isPending}
                  className="btn btn-primary w-full py-3.5 shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                >
                  {actions.accept.isPending ? 'Đang nhận...' : <>Tiếp Nhận Nhiệm Vụ <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= CHẾ ĐỘ 2: ĐANG LÀM NHIỆM VỤ - CẬP NHẬT TRẠNG THÁI =================
  if (view === 'tracking') {
    return (
      <div className="animate-fade-in max-w-6xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--primary)] mb-1">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              Nhiệm vụ đang thực hiện
            </div>
            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Cứu hộ: {activeRequest.loaiSuCo || 'Sửa chữa'}</h1>
          </div>
          <button 
            onClick={() => setView('invoice')}
            className="btn bg-white border border-[var(--border)] text-[var(--text-main)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm"
          >
            Chuyển sang Hoá đơn
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 flex-1 min-h-0">
          {/* Map Area */}
          <div className="card bg-slate-900 overflow-hidden relative min-h-[400px]">
            <div className="absolute inset-0 bg-[url('https://maps.gstatic.com/tactile/basemap/roadmap-2x.png')] opacity-30 bg-cover bg-center"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <MapPin size={48} className="text-slate-500 mb-4 opacity-50" />
              <p className="font-bold tracking-widest uppercase text-sm">Hệ Thống Bản Đồ GPS</p>
            </div>
            
            {/* Overlay Info on Map */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center">
                  <Navigation size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Điểm đến</div>
                  <div className="font-bold text-[var(--text-main)] truncate max-w-sm">{activeRequest.diaChi}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[var(--primary)]">15<span className="text-sm">phút</span></div>
                <div className="text-xs font-bold text-[var(--text-muted)]">Khoảng cách: 4.2km</div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="card p-6">
              <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Thông Tin Khách Hàng</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md font-bold text-xl">
                  {activeRequest.tenKhachHang ? activeRequest.tenKhachHang.charAt(0) : 'K'}
                </div>
                <div>
                  <div className="text-lg font-black text-[var(--text-main)]">{activeRequest.tenKhachHang || 'Khách hàng'}</div>
                  <div className="text-sm font-bold text-[var(--text-sub)] mt-1">{activeRequest.soDienThoai || '09xx xxx xxx'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="btn bg-[var(--bg-body)] border border-[var(--border)] text-[var(--text-main)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5">
                  <Phone size={16} /> Gọi điện
                </button>
                <button className="btn bg-[var(--bg-body)] border border-[var(--border)] text-[var(--text-main)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5">
                  <MessageSquare size={16} /> Nhắn tin
                </button>
              </div>
            </div>

            <div className="card p-6 flex-1 flex flex-col">
              <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Trạng Thái & Thao Tác</h3>
              
              <div className="p-4 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/20 mb-auto">
                <div className="text-[10px] text-[var(--primary)] font-black uppercase tracking-widest mb-1.5">Tình Trạng Hiện Tại</div>
                <div className="text-lg font-black text-[var(--primary)]">
                  {activeRequest.trangThaiHienTai === 'accepted' ? 'Đang di chuyển đến khách' : activeRequest.trangThaiHienTai}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  actions.updateStatus.mutate({ id: activeRequest.id, status: 'arrived' });
                  setView('invoice');
                }} 
                disabled={actions.updateStatus.isPending}
                className="btn btn-primary w-full py-4 text-base shadow-lg shadow-[var(--primary)]/30 mt-6"
              >
                {actions.updateStatus.isPending ? 'Đang cập nhật...' : <><MapPin size={20} /> Xác nhận Đã Đến Hiện Trường</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= CHẾ ĐỘ 3: CHỐT HÓA ĐƠN VÀ HOÀN THÀNH =================
  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--primary)]">
            <CheckCircle2 size={14} /> <span>Bước cuối cùng</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Xác nhận hoàn thành</h1>
          <p className="text-[var(--text-sub)] max-w-2xl font-medium">Kiểm tra thông tin chi tiết nhiệm vụ và chi phí trước khi gửi hóa đơn cho khách.</p>
        </div>
        <button 
          onClick={() => {
            actions.complete.mutate({ id: activeRequest.id, finalCost: finalCost });
            setView('tracking');
          }} 
          disabled={actions.complete.isPending}
          className="btn py-3.5 px-6 font-bold shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white border-none"
        >
          {actions.complete.isPending ? 'Đang xử lý...' : <>Hoàn thành & Gửi báo cáo <Send size={18} /></>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-[var(--primary)]" size={24} />
              <h3 className="text-xl font-black text-[var(--text-main)]">Thông tin hóa đơn</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 p-5 bg-[var(--bg-body)] rounded-2xl border border-[var(--border)] mb-8">
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Khách Hàng</div>
                <div className="text-base font-black text-[var(--text-main)]">{activeRequest.tenKhachHang}</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Loại Sự Cố</div>
                <div className="text-base font-black text-[var(--text-main)]">{activeRequest.loaiSuCo || 'Sửa chữa'}</div>
              </div>
            </div>
            
            <div>
              <div className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Chi Phí Thực Tế Thu Khách (VNĐ)</div>
              <div className="relative">
                <BadgeDollarSign size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  type="number" 
                  value={finalCost} 
                  onChange={(e) => setFinalCost(Number(e.target.value))}
                  className="w-full bg-white border-2 border-[var(--border)] rounded-2xl pl-14 pr-6 py-4 text-2xl font-black focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/10 text-[var(--primary)]" 
                />
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Ghi chú tình trạng / Kết quả</h3>
            <textarea 
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl p-5 outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 resize-none font-medium text-sm"
              rows={5} 
              placeholder="Ghi chú chi tiết kết quả sửa chữa, các phụ tùng đã thay thế (nếu có)..." 
            />
          </div>
        </div>

        <div className="card p-0 overflow-hidden h-fit border-2 border-[var(--primary)]/20 shadow-xl">
          <div className="bg-gradient-to-br from-[var(--primary)] to-blue-700 p-6 text-white text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Tổng Kết Thanh Toán</h3>
            <div className="text-3xl font-black mt-2">{new Intl.NumberFormat('vi-VN').format(finalCost)} ₫</div>
          </div>
          <div className="p-6 bg-white">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">
                Xin hãy xác nhận bạn đã nhận đủ <span className="font-black">{new Intl.NumberFormat('vi-VN').format(finalCost)}đ</span> tiền mặt hoặc chuyển khoản trực tiếp từ khách hàng trước khi bấm Hoàn thành.
              </p>
            </div>
            
            <button 
              onClick={() => { setView('tracking'); }} 
              className="btn bg-[var(--bg-body)] text-[var(--text-main)] hover:bg-gray-200 border-none w-full mt-4 font-bold"
            >
              Quay lại theo dõi map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}