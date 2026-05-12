import React, { useState, useEffect } from 'react';

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
    <div className="bg-[#f8f9fb] font-['Inter'] text-[#191c1e] min-h-screen">
      {/* pt-32 để không bị che bởi Navbar cố định */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Xác nhận & Đánh giá */}
          <div className="flex-1 space-y-8">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fed01b] text-[#6f5900] rounded-full text-xs font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Dịch vụ hoàn tất
              </div>
              <h1 className="font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#191c1e]">
                Cảm ơn bạn đã tin tưởng Guardian
              </h1>
              <p className="text-[#434654] text-lg max-w-xl">
                Hành trình của bạn đã được tiếp tục an toàn. Chúng tôi hy vọng bạn hài lòng với dịch vụ vừa rồi.
              </p>
            </header>

            {/* Thẻ Kỹ thuật viên */}
            <div className="bg-white rounded-[2rem] p-8 flex items-center gap-6 shadow-sm border border-[#edeef0]">
              <img 
                alt="Technician" 
                className="w-24 h-24 rounded-2xl object-cover" 
                src="https://i.pravatar.cc/150?u=hoang" 
              />
              <div>
                <p className="text-xs font-bold text-[#737686] uppercase tracking-widest mb-1">Kỹ thuật viên thực hiện</p>
                <h3 className="font-['Manrope'] text-2xl font-black text-[#003fb1]">Nguyễn Văn Hoàng</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#fed01b] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <div className="h-4 w-px bg-[#edeef0]"></div>
                  <span className="text-sm text-[#434654] font-medium">1,250 chuyến thành công</span>
                </div>
              </div>
            </div>

            {/* Hệ thống Đánh giá */}
            <div className="bg-[#f3f4f6] rounded-[2.5rem] p-8 space-y-8">
              <h2 className="font-['Manrope'] text-xl font-bold">Đánh giá dịch vụ</h2>
              
              {/* Star Rating */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className={`material-symbols-outlined text-4xl transition-all active:scale-90 ${
                      star <= rating ? 'text-[#fed01b]' : 'text-[#c3c5d7]'
                    }`}
                    style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-[#737686] uppercase tracking-widest">Ưu điểm nổi bật</p>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
                        selectedTags.includes(tag)
                        ? 'bg-[#003fb1] border-[#003fb1] text-white shadow-lg shadow-[#003fb1]/20'
                        : 'bg-white border-transparent text-[#434654] hover:border-[#003fb1]/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#737686] uppercase tracking-widest">Góp ý thêm</label>
                <textarea 
                  className="w-full bg-white border-0 rounded-2xl p-5 h-32 focus:ring-2 focus:ring-[#003fb1]/20 outline-none text-sm resize-none" 
                  placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                />
              </div>

              <button className="w-full bg-[#003fb1] text-white py-5 rounded-full font-black text-lg shadow-xl hover:bg-[#1a56db] transition-all active:scale-95">
                Gửi đánh giá & Kết thúc
              </button>
            </div>
          </div>

          {/* Cột phải: Hóa đơn (Sticky) */}
          <aside className="w-full lg:w-[400px]">
            <div className="lg:sticky lg:top-28 bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-[#edeef0]">
              <div className="p-8 bg-[#003fb1] text-white">
                <h2 className="font-['Manrope'] text-xl font-bold">Chi tiết thanh toán</h2>
                <p className="text-white/60 text-xs font-mono mt-1">Mã đơn: #GR-2849102</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">Cứu hộ xe con (Sedan)</p>
                      <p className="text-[10px] text-[#737686] font-bold uppercase">Phí cơ bản</p>
                    </div>
                    <span className="font-bold">500.000đ</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">Kích bình ắc quy</p>
                      <p className="text-[10px] text-[#737686] font-bold uppercase">Dịch vụ tại chỗ</p>
                    </div>
                    <span className="font-bold">250.000đ</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">Phụ phí ban đêm</p>
                      <p className="text-[10px] text-[#737686] font-bold uppercase">22:00 - 06:00</p>
                    </div>
                    <span className="font-bold">100.000đ</span>
                  </div>
                </div>

                <div className="h-px bg-[#edeef0]"></div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-[#737686]">
                    <span>Thuế VAT (10%)</span>
                    <span>85.000đ</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black font-['Manrope']">Tổng cộng</span>
                    <span className="text-3xl font-black text-[#003fb1] tracking-tighter">935.000đ</span>
                  </div>
                </div>

                <div className="bg-[#f3f4f6] p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#003fb1]">account_balance_wallet</span>
                    <div>
                      <p className="text-[10px] font-black text-[#737686] uppercase">Phương thức</p>
                      <p className="text-xs font-bold">Ví Guardian (**** 8821)</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#fed01b]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>

                <button className="w-full py-4 border-2 border-[#003fb1] text-[#003fb1] font-bold rounded-full hover:bg-[#003fb1]/5 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>
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