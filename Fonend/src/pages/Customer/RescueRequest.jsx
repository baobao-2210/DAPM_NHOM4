import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BatteryWarning, Car, HelpCircle, MapPin, Send, ShieldCheck } from 'lucide-react';

const RescueRequest = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState('Hết bình');

  const issues = [
    { id: 'tire', label: 'Xẹp lốp', icon: <Settings size={32} /> },
    { id: 'battery', label: 'Hết bình', icon: <BatteryWarning size={32} /> },
    { id: 'crash', label: 'Tai nạn', icon: <Car size={32} /> },
    { id: 'other', label: 'Khác', icon: <HelpCircle size={32} /> },
  ];

  return (
    <div className="bg-[var(--bg-body)] min-h-screen font-sans">
      <main className="pt-24 pb-32 max-w-5xl mx-auto px-6 animate-fade-in">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight mb-2">
            Tạo yêu cầu cứu hộ mới
          </h1>
          <p className="text-[var(--text-sub)] text-lg font-medium">
            Cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn nhanh nhất.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Form Section */}
          <div className="flex-1 space-y-8 w-full">
            {/* Section 1: Thông tin xe */}
            <section className="card p-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black">1</span>
                <h2 className="text-2xl font-black text-[var(--text-main)]">Thông tin xe</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Hãng xe</label>
                  <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-semibold transition-all text-[var(--text-main)]" placeholder="Toyota, Mercedes..." type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Biển số</label>
                  <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-black text-[var(--primary)] uppercase transition-all" placeholder="30A-123.45" type="text"/>
                </div>
              </div>
            </section>

            {/* Section 2: Vị trí sự cố */}
            <section className="card p-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black">2</span>
                <h2 className="text-2xl font-black text-[var(--text-main)]">Vị trí sự cố</h2>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={20} />
                  <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-semibold transition-all text-[var(--text-main)]" placeholder="Nhập địa chỉ hiện tại của bạn" type="text"/>
                </div>
                <div className="relative h-72 rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-inner">
                  <img className="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" alt="Map Preview" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[var(--primary)]/20 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-6 h-6 bg-[var(--primary)] rounded-full shadow-[0_0_15px_rgba(0,63,177,0.5)] border-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Loại sự cố */}
            <section className="card p-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black">3</span>
                <h2 className="text-2xl font-black text-[var(--text-main)]">Mô tả sự cố</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {issues.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedIssue(item.label)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedIssue === item.label 
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-sm' 
                      : 'border-[var(--border)] bg-[var(--bg-body)] hover:border-[var(--primary)]/30 text-[var(--text-muted)] hover:bg-white'
                    }`}
                  >
                    <div className="mb-3">{item.icon}</div>
                    <span className="text-sm font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-semibold transition-all resize-none text-[var(--text-main)] placeholder-[var(--text-muted)]" 
                placeholder="Ghi chú thêm về tình trạng xe..." 
                rows="4"
              ></textarea>
            </section>
          </div>

          {/* Right Summary Panel */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-28">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--primary)]/40 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-black flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
                Tóm tắt yêu cầu
                <span className="text-[10px] bg-[var(--accent)] text-amber-900 px-3 py-1.5 rounded-full uppercase tracking-widest font-black shadow-[0_0_10px_rgba(254,208,27,0.3)]">Ưu tiên</span>
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Sự cố</span>
                  <span className="font-bold">{selectedIssue}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Phí cơ bản</span>
                  <span className="font-bold">500.000đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Phí di chuyển</span>
                  <span className="font-bold">180.000đ</span>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-2 tracking-widest">Tổng chi phí dự kiến</p>
                  <h4 className="text-4xl font-black text-[var(--accent)] tracking-tight">680.000đ</h4>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/estimation')}
                  className="btn bg-[var(--primary)] hover:bg-blue-700 text-white w-full py-4 rounded-full font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-95 group border-none mt-4"
                >
                  Gửi yêu cầu ngay
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[var(--primary)] flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <p className="text-xs font-bold text-blue-900/70 leading-relaxed">Cam kết hỗ trợ trong <span className="text-[var(--primary)] font-black">15-30 phút</span> kể từ khi xác nhận.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RescueRequest;