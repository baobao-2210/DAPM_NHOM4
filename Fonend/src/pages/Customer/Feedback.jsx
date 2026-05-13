import { useState } from 'react';
import { Star } from 'lucide-react';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(4);

  return (
    <div className="bg-[var(--bg-body)] min-h-screen text-[var(--text-main)] font-sans">
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto animate-fade-in">
        <div className="card p-10 shadow-xl border-2 border-[var(--primary)]/5">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-[var(--primary)] mb-3">Gửi phản hồi của bạn</h1>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed font-medium">
              Chúng tôi đánh giá cao mọi đóng góp. Hãy chia sẻ trải nghiệm sử dụng dịch vụ để chúng tôi cải thiện mỗi ngày.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-[var(--bg-body)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm">
              <h2 className="font-black text-2xl mb-4 text-[var(--text-main)]">Đánh giá trải nghiệm</h2>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-all active:scale-90 p-1 ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                  >
                    <Star size={48} fill={star <= rating ? "currentColor" : "none"} strokeWidth={star <= rating ? 0 : 2} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Nội dung phản hồi</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mô tả chi tiết trải nghiệm của bạn..."
                className="w-full min-h-[220px] rounded-3xl border border-[var(--border)] bg-white p-6 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all font-semibold text-[var(--text-main)] placeholder-[var(--text-muted)] resize-none shadow-inner"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary w-full md:w-auto px-12 py-5 rounded-full font-black text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center"
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
