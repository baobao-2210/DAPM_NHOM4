import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RescueRequest = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState('Hết bình');

  const issues = [
    { id: 'tire', label: 'Xẹp lốp', icon: 'tire_repair' },
    { id: 'battery', label: 'Hết bình', icon: 'battery_charging_full' },
    { id: 'crash', label: 'Tai nạn', icon: 'car_crash' },
    { id: 'other', label: 'Khác', icon: 'question_mark' },
  ];

  return (
    <div className="bg-[#f8f9fb] min-h-screen font-['Inter']">
      {/* LƯU Ý: Navbar của bạn đã được đặt ở App.jsx nên không cần bỏ vào đây.
        pt-24 để tránh bị Navbar che khuất nội dung.
      */}
      <main className="pt-24 pb-32 max-w-5xl mx-auto px-6">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-['Manrope'] font-black text-[#191c1e] tracking-tight mb-2">
            Tạo yêu cầu cứu hộ mới
          </h1>
          <p className="text-[#434654] text-lg">
            Cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn nhanh nhất.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Form Section */}
          <div className="flex-1 space-y-8 w-full">
            {/* Section 1: Thông tin xe */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#003fb1] flex items-center justify-center font-bold">1</span>
                <h2 className="text-2xl font-['Manrope'] font-bold text-[#191c1e]">Thông tin xe</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#737686] ml-1">Hãng xe</label>
                  <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none" placeholder="Toyota, Mercedes..." type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#737686] ml-1">Biển số</label>
                  <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none font-bold text-[#003fb1]" placeholder="30A-123.45" type="text"/>
                </div>
              </div>
            </section>

            {/* Section 2: Vị trí sự cố */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#003fb1] flex items-center justify-center font-bold">2</span>
                <h2 className="text-2xl font-['Manrope'] font-bold text-[#191c1e]">Vị trí sự cố</h2>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#003fb1]">location_on</span>
                  <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl pl-14 pr-5 py-5 focus:ring-2 focus:ring-[#003fb1]/20 outline-none" placeholder="Nhập địa chỉ hiện tại của bạn" type="text"/>
                </div>
                <div className="relative h-72 rounded-[2rem] overflow-hidden border border-[#edeef0]">
                  <img className="w-full h-full object-cover opacity-80" src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" alt="Map Preview" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#003fb1]/20 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-6 h-6 bg-[#003fb1] rounded-full shadow-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Loại sự cố */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#003fb1] flex items-center justify-center font-bold">3</span>
                <h2 className="text-2xl font-['Manrope'] font-bold text-[#191c1e]">Mô tả sự cố</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {issues.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedIssue(item.label)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedIssue === item.label 
                      ? 'border-[#003fb1] bg-[#dbe1ff]/30 text-[#003fb1]' 
                      : 'border-[#edeef0] hover:border-[#003fb1]/30 text-[#737686]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-4xl mb-3">{item.icon}</span>
                    <span className="text-sm font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none" 
                placeholder="Ghi chú thêm về tình trạng xe..." 
                rows="4"
              ></textarea>
            </section>
          </div>

          {/* Right Summary Panel */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
            <div className="bg-[#191c1e] text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8">
              <h3 className="text-xl font-['Manrope'] font-black flex justify-between items-center border-b border-white/10 pb-6">
                Tóm tắt yêu cầu
                <span className="text-[10px] bg-[#fed01b] text-[#231b00] px-3 py-1 rounded-full uppercase tracking-widest font-black">Ưu tiên</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Sự cố</span>
                  <span className="font-bold">{selectedIssue}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Phí cơ bản</span>
                  <span className="font-bold">500.000đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Phí di chuyển</span>
                  <span className="font-bold">180.000đ</span>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase font-black mb-2 tracking-widest">Tổng chi phí dự kiến</p>
                  <h4 className="text-4xl font-['Manrope'] font-black text-[#fed01b] tracking-tighter">680.000đ</h4>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/estimation')}
                  className="w-full py-5 bg-[#003fb1] text-white rounded-full font-black text-lg shadow-xl hover:bg-[#1a56db] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Gửi yêu cầu ngay
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                </button>
              </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-2xl border border-[#edeef0] flex items-center gap-4">
              <span className="material-symbols-outlined text-[#735c00] text-3xl">verified_user</span>
              <p className="text-xs font-bold text-[#434654]">Cam kết hỗ trợ trong 15-30 phút kể từ khi xác nhận.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RescueRequest;