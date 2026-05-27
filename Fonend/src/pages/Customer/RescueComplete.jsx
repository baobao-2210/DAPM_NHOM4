import React, { useState } from 'react';
import { CheckCircle, Star, Wallet, ShieldCheck, Download } from 'lucide-react';

const RescueComplete = () => {
  const [rating, setRating] = useState(4);
  const [selectedTags, setSelectedTags] = useState(['Professional', 'Thân thiện']);

  const tags = ['Professional', 'Punctual', 'Thân thiện', 'An toàn', 'Thiết bị hiện đại'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen">
      {/* pt-32 để không bị che bởi Navbar cố định */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Xác nhận & Đánh giá */}
          <div className="flex-1 space-y-8">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-amber-900 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                <CheckCircle size={16} />
                Dịch vụ hoàn tất
              </div>
              <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
                Cảm ơn bạn đã tin tưởng Guardian
              </h1>
              <p className="text-[var(--text-sub)] font-medium text-lg max-w-xl">
                Hành trình của bạn đã được tiếp tục an toàn. Chúng tôi hy vọng bạn hài lòng với dịch vụ vừa rồi.
              </p>
            </header>

            {/* Thẻ Kỹ thuật viên */}
            <div className="card p-8 flex items-center gap-6">
              <img 
                alt="Technician" 
                className="w-24 h-24 rounded-2xl object-cover shadow-sm" 
                src="https://i.pravatar.cc/150?u=hoang" 
              />
              <div>
                <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Kỹ thuật viên thực hiện</p>
                <h3 className="text-2xl font-black text-[var(--primary)]">Nguyễn Văn Hoàng</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-[var(--text-main)]">4.9</span>
                  </div>
                  <div className="h-4 w-px bg-[var(--border)]"></div>
                  <span className="text-sm text-[var(--text-sub)] font-semibold">1,250 chuyến thành công</span>
                </div>
              </div>
            </div>

            {/* Hệ thống Đánh giá */}
            <div className="card bg-[var(--bg-body)] p-8 space-y-8">
              <h2 className="text-xl font-black text-[var(--text-main)]">Đánh giá dịch vụ</h2>
              
              {/* Star Rating */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-all active:scale-90 p-1 ${
                      star <= rating ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    <Star size={40} fill={star <= rating ? "currentColor" : "none"} strokeWidth={star <= rating ? 0 : 2} />
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Ưu điểm nổi bật</p>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
                        selectedTags.includes(tag)
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                        : 'bg-white border-transparent text-[var(--text-sub)] hover:border-[var(--primary)]/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Góp ý thêm</label>
                <textarea 
                  className="w-full bg-white border border-[var(--border)] rounded-2xl p-5 h-32 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none text-sm resize-none font-semibold text-[var(--text-main)] placeholder-[var(--text-muted)] transition-all" 
                  placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                />
              </div>

              <button className="btn btn-primary w-full py-5 rounded-full font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                Gửi đánh giá & Kết thúc
              </button>
            </div>
          </div>

          {/* Cột phải: Hóa đơn (Sticky) */}
          <aside className="w-full lg:w-[400px]">
            <div className="lg:sticky lg:top-28 bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-[var(--border)]">
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary)]/30 rounded-full blur-3xl"></div>
                <h2 className="text-xl font-black relative z-10">Chi tiết thanh toán</h2>
                <p className="text-white/60 text-xs font-mono mt-1 font-bold relative z-10">Mã đơn: #GR-2849102</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-[var(--text-main)]">Cứu hộ xe con (Sedan)</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-0.5">Phí cơ bản</p>
                    </div>
                    <span className="font-bold text-[var(--text-main)]">500.000đ</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-[var(--text-main)]">Kích bình ắc quy</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-0.5">Dịch vụ tại chỗ</p>
                    </div>
                    <span className="font-bold text-[var(--text-main)]">250.000đ</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-[var(--text-main)]">Phụ phí ban đêm</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-0.5">22:00 - 06:00</p>
                    </div>
                    <span className="font-bold text-[var(--text-main)]">100.000đ</span>
                  </div>
                </div>

                <div className="h-px bg-[var(--border)]"></div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-[var(--text-sub)]">
                    <span>Thuế VAT (10%)</span>
                    <span>85.000đ</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-[var(--text-main)]">Tổng cộng</span>
                    <span className="text-3xl font-black text-[var(--primary)] tracking-tight">935.000đ</span>
                  </div>
                </div>

                <div className="bg-[var(--bg-body)] p-5 rounded-2xl flex items-center justify-between border border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <Wallet className="text-[var(--primary)] shrink-0" size={24} />
                    <div>
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Phương thức</p>
                      <p className="text-xs font-bold text-[var(--text-main)] mt-0.5">Ví Guardian (**** 8821)</p>
                    </div>
                  </div>
                  <ShieldCheck className="text-amber-500" size={20} />
                </div>

                <button className="w-full py-4 border-2 border-[var(--primary)] text-[var(--primary)] font-bold rounded-full hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-2 group active:scale-95 bg-white">
                  <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                  Tải hóa đơn (PDF)
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default RescueComplete;