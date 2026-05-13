import React, { useState } from 'react';
import { Users, Wrench, Clock, Route, MoreHorizontal, MapPin, AlertTriangle } from 'lucide-react';

const CancelRequest = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { id: 'another_unit', label: 'Đã tìm được đơn vị hỗ trợ khác', icon: <Users size={20} /> },
    { id: 'self_fixed', label: 'Tôi tự khắc phục được sự cố', icon: <Wrench size={20} /> },
    { id: 'long_wait', label: 'Thời gian chờ đợi quá lâu', icon: <Clock size={20} /> },
    { id: 'change_route', label: 'Thay đổi lộ trình di chuyển', icon: <Route size={20} /> },
    { id: 'other', label: 'Lý do khác', icon: <MoreHorizontal size={20} /> },
  ];

  const handleCancelAction = () => {
    const finalReason = selectedReason === 'other' ? otherReason : selectedReason;
    console.log("Hủy yêu cầu với lý do:", finalReason);
    // Xử lý logic hủy tại đây (gọi API, chuyển trang...)
  };

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen flex flex-col">
      {/* LƯU Ý: Navbar của bạn đã được đặt ở App.jsx nên không cần bỏ vào đây.
         Sử dụng pt-32 để tránh bị che bởi Navbar cố định.
      */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Thông tin yêu cầu & Cảnh báo */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">
                Hủy yêu cầu cứu hộ
              </h1>
              <p className="text-[var(--text-sub)] leading-relaxed font-medium">
                Chúng tôi rất tiếc khi biết bạn muốn hủy dịch vụ. Vui lòng cung cấp lý do để chúng tôi cải thiện chất lượng.
              </p>
            </div>

            {/* Chi tiết yêu cầu hiện tại */}
            <div className="card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Mã yêu cầu</span>
                <span className="font-mono font-bold text-[var(--primary)]">#GR-88291-VN</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Wrench size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Loại dịch vụ</p>
                    <p className="font-bold text-lg text-[var(--text-main)]">Thay lốp dự phòng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[var(--text-muted)] shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Vị trí hiện tại</p>
                    <p className="font-medium text-sm text-[var(--text-main)] mt-0.5">123 Đường Lê Lợi, Quận 1, TP. HCM</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-sub)] font-medium">Thời gian yêu cầu</span>
                  <span className="font-bold text-[var(--text-main)]">14:20, 24 Tháng 5, 2026</span>
                </div>
              </div>
            </div>

            {/* Thẻ cảnh báo phí hủy */}
            <div className="bg-red-50 p-6 rounded-[2rem] flex gap-4 items-start border border-red-100 shadow-sm">
              <AlertTriangle className="text-red-600 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-red-700">Lưu ý phí hủy chuyến</h4>
                <p className="text-sm text-red-900/80 mt-1.5 leading-relaxed font-semibold">
                  Vì kỹ thuật viên đã được điều động, phí hủy chuyến <strong>50.000đ</strong> sẽ được áp dụng cho yêu cầu này.
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form chọn lý do */}
          <div className="lg:col-span-7">
            <div className="card bg-[var(--bg-body)] p-8 space-y-8">
              <h3 className="text-xl font-black text-[var(--text-main)]">Chọn lý do hủy</h3>
              <div className="grid grid-cols-1 gap-4">
                {reasons.map((reason) => (
                  <div key={reason.id} className="space-y-3">
                    <label 
                      className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all active:scale-[0.98] border-2 ${
                        selectedReason === reason.id 
                        ? 'bg-[var(--primary)]/5 border-[var(--primary)] shadow-sm' 
                        : 'bg-white border-[var(--border)] hover:border-[var(--primary)]/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedReason === reason.id ? 'border-[var(--primary)]' : 'border-[var(--text-muted)]'
                        }`}>
                          {selectedReason === reason.id && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                        </div>
                        <span className={`font-bold text-sm ${selectedReason === reason.id ? 'text-[var(--primary)]' : 'text-[var(--text-sub)]'}`}>
                          {reason.label}
                        </span>
                      </div>
                      <span className={`${selectedReason === reason.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                        {reason.icon}
                      </span>
                      <input 
                        type="radio" 
                        name="reason" 
                        className="hidden" 
                        value={reason.id} 
                        onChange={() => setSelectedReason(reason.id)}
                      />
                    </label>
                    
                    {/* Ô nhập lý do khác nếu được chọn */}
                    {reason.id === 'other' && selectedReason === 'other' && (
                      <textarea 
                        className="w-full bg-white border-2 border-[var(--primary)]/20 rounded-2xl p-5 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none text-sm h-32 resize-none animate-fade-in text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]" 
                        placeholder="Vui lòng mô tả chi tiết lý do của bạn..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button className="flex-1 px-8 py-5 rounded-full font-bold border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all active:scale-95 bg-white">
                  Quay lại
                </button>
                <button 
                  onClick={handleCancelAction}
                  disabled={!selectedReason}
                  className={`flex-[2] px-8 py-5 rounded-full font-black text-lg shadow-xl transition-all active:scale-95 ${
                    selectedReason 
                    ? 'bg-red-600 text-white shadow-red-600/20 hover:bg-red-700' 
                    : 'bg-slate-300 text-white cursor-not-allowed shadow-none'
                  }`}
                >
                  Xác nhận hủy yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CancelRequest;