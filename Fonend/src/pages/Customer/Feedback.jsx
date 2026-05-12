import { useState } from 'react';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(4);

  return (
    <div className="bg-[#f8f9fb] min-h-screen text-[#191c1e] font-['Inter']">
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#edeef0] p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-black font-['Manrope'] text-[#003fb1] mb-3">Gửi phản hồi của bạn</h1>
            <p className="text-[#434654] text-sm leading-relaxed">
              Chúng tôi đánh giá cao mọi đóng góp. Hãy chia sẻ trải nghiệm sử dụng dịch vụ để chúng tôi cải thiện mỗi ngày.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-[#f3f4f6] p-8 rounded-[2rem]">
              <h2 className="font-black text-2xl mb-4">Đánh giá trải nghiệm</h2>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`material-symbols-outlined text-4xl transition-all ${star <= rating ? 'text-[#fed01b]' : 'text-[#c3c5d7]'}`}
                    style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-[#737686]">Nội dung phản hồi</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mô tả chi tiết trải nghiệm của bạn..."
                className="w-full min-h-[220px] rounded-3xl border border-[#edeef0] bg-[#f8f9fb] p-5 text-sm outline-none focus:ring-2 focus:ring-[#003fb1]/20"
              />
            </div>

            <button
              type="button"
              className="bg-[#003fb1] text-white px-10 py-4 rounded-full font-black text-sm shadow-xl hover:bg-[#1a56db] transition-all active:scale-95"
            >
              Gửi phản hồi
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
