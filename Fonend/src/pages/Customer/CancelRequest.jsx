import React, { useState } from 'react';

const CancelRequest = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { id: 'another_unit', label: 'Đã tìm được đơn vị hỗ trợ khác', icon: 'group_work' },
    { id: 'self_fixed', label: 'Tôi tự khắc phục được sự cố', icon: 'build' },
    { id: 'long_wait', label: 'Thời gian chờ đợi quá lâu', icon: 'schedule' },
    { id: 'change_route', label: 'Thay đổi lộ trình di chuyển', icon: 'route' },
    { id: 'other', label: 'Lý do khác', icon: 'more_horiz' },
  ];

  const handleCancelAction = () => {
    const finalReason = selectedReason === 'other' ? otherReason : selectedReason;
    console.log("Hủy yêu cầu với lý do:", finalReason);
    // Xử lý logic hủy tại đây (gọi API, chuyển trang...)
  };

  return (
    <div className="bg-[#f8f9fb] font-['Inter'] text-[#191c1e] min-h-screen flex flex-col">
      {/* LƯU Ý: Navbar của bạn đã được đặt ở App.jsx nên không cần bỏ vào đây.
         Sử dụng pt-32 để tránh bị che bởi Navbar cố định.
      */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Thông tin yêu cầu & Cảnh báo */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold font-['Manrope'] tracking-tight text-[#003fb1]">
                Hủy yêu cầu cứu hộ
              </h1>
              <p className="text-[#434654] leading-relaxed">
                Chúng tôi rất tiếc khi biết bạn muốn hủy dịch vụ. Vui lòng cung cấp lý do để chúng tôi cải thiện chất lượng.
              </p>
            </div>

            {/* Chi tiết yêu cầu hiện tại */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6 border border-[#edeef0]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-[#737686]">Mã yêu cầu</span>
                <span className="font-mono font-bold text-[#003fb1]">#GR-88291-VN</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#dbe1ff] flex items-center justify-center text-[#003fb1]">
                    <span className="material-symbols-outlined">car_repair</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#737686] uppercase">Loại dịch vụ</p>
                    <p className="font-bold text-lg">Thay lốp dự phòng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[#737686]">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#737686] uppercase">Vị trí hiện tại</p>
                    <p className="font-medium text-sm">123 Đường Lê Lợi, Quận 1, TP. HCM</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-[#edeef0]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#434654] font-medium">Thời gian yêu cầu</span>
                  <span className="font-bold">14:20, 24 Tháng 5, 2026</span>
                </div>
              </div>
            </div>

            {/* Thẻ cảnh báo phí hủy */}
            <div className="bg-[#ffdad6] p-6 rounded-[2rem] flex gap-4 items-start border border-[#ba1a1a]/10">
              <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <h4 className="font-bold text-[#93000a]">Lưu ý phí hủy chuyến</h4>
                <p className="text-sm text-[#93000a]/80 mt-1 leading-relaxed">
                  Vì kỹ thuật viên đã được điều động, phí hủy chuyến <strong>50.000đ</strong> sẽ được áp dụng cho yêu cầu này.
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form chọn lý do */}
          <div className="lg:col-span-7">
            <div className="bg-[#f3f4f6] p-8 rounded-[2.5rem] space-y-8">
              <h3 className="text-xl font-bold font-['Manrope'] text-[#191c1e]">Chọn lý do hủy</h3>
              <div className="grid grid-cols-1 gap-4">
                {reasons.map((reason) => (
                  <div key={reason.id} className="space-y-3">
                    <label 
                      className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all active:scale-[0.98] border-2 ${
                        selectedReason === reason.id 
                        ? 'bg-[#dbe1ff] border-[#003fb1]' 
                        : 'bg-white border-transparent hover:border-[#003fb1]/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedReason === reason.id ? 'border-[#003fb1]' : 'border-[#737686]'
                        }`}>
                          {selectedReason === reason.id && <div className="w-3 h-3 rounded-full bg-[#003fb1]"></div>}
                        </div>
                        <span className={`font-bold text-sm ${selectedReason === reason.id ? 'text-[#003fb1]' : 'text-[#434654]'}`}>
                          {reason.label}
                        </span>
                      </div>
                      <span className={`material-symbols-outlined ${selectedReason === reason.id ? 'text-[#003fb1]' : 'text-[#737686]'}`}>
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
                        className="w-full bg-white border-2 border-[#003fb1]/20 rounded-2xl p-5 focus:ring-2 focus:ring-[#003fb1]/20 outline-none text-sm h-32 resize-none animate-in fade-in slide-in-from-top-2 duration-300" 
                        placeholder="Vui lòng mô tả chi tiết lý do của bạn..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button className="flex-1 px-8 py-5 rounded-full font-bold border-2 border-[#003fb1] text-[#003fb1] hover:bg-[#003fb1]/5 transition-all active:scale-95">
                  Quay lại
                </button>
                <button 
                  onClick={handleCancelAction}
                  disabled={!selectedReason}
                  className={`flex-[2] px-8 py-5 rounded-full font-black text-lg shadow-xl transition-all active:scale-95 ${
                    selectedReason 
                    ? 'bg-[#ba1a1a] text-white shadow-[#ba1a1a]/20 hover:opacity-90' 
                    : 'bg-[#c3c5d7] text-white cursor-not-allowed shadow-none'
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