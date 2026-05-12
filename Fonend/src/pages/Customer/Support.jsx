import { Link } from 'react-router-dom';

const Support = () => {
  const faqs = [
    { question: 'Làm sao để đặt yêu cầu cứu hộ?', answer: 'Bạn vào trang Dịch vụ và chọn Yêu cầu cứu hộ, sau đó điền thông tin xe và vị trí.' },
    { question: 'Thời gian phục vụ là bao lâu?', answer: 'Đội ngũ kỹ thuật sẽ có mặt trong 15-30 phút kể từ khi xác nhận yêu cầu.' },
    { question: 'Tôi có thể hủy yêu cầu không?', answer: 'Bạn có thể hủy yêu cầu trong trang Lịch sử hoặc Hủy yêu cầu. Một khoản phí hủy có thể được áp dụng.' },
  ];

  return (
    <div className="bg-[#f8f9fb] min-h-screen text-[#191c1e] font-['Inter']">
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#edeef0]">
            <h1 className="text-4xl font-black font-['Manrope'] text-[#003fb1] mb-4">Trung tâm hỗ trợ</h1>
            <p className="text-[#434654] text-sm leading-relaxed mb-8">
              Nếu bạn cần trợ giúp, hãy tham khảo các câu hỏi thường gặp hoặc gửi phản hồi trực tiếp cho đội ngũ chúng tôi.
            </p>

            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <div key={idx} className="rounded-[2rem] border border-[#edeef0] p-6 bg-[#f8f9fb]">
                  <h3 className="font-black text-lg text-[#191c1e] mb-2">{item.question}</h3>
                  <p className="text-sm text-[#434654] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-[#003fb1] text-white p-10 rounded-[2.5rem] shadow-xl border border-[#003fb1]/10">
              <h2 className="text-2xl font-black mb-4">Bạn cần hỗ trợ gấp?</h2>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Liên hệ ngay qua điện thoại hoặc gửi phản hồi để đội ngũ RescueGuard hỗ trợ nhanh nhất.
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold uppercase text-[10px] tracking-widest text-white/70">Hotline</p>
                  <p className="mt-1">0901 234 567</p>
                </div>
                <div>
                  <p className="font-bold uppercase text-[10px] tracking-widest text-white/70">Email</p>
                  <p className="mt-1">support@rescueguard.vn</p>
                </div>
              </div>

              <Link
                to="/feedback"
                className="inline-flex items-center justify-center gap-2 mt-8 w-full bg-[#fed01b] text-[#6f5900] font-black uppercase py-4 rounded-full shadow-lg hover:opacity-95 transition-all"
              >
                Gửi phản hồi
                <span className="material-symbols-outlined">send</span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-[#edeef0] shadow-sm">
              <h3 className="text-lg font-black mb-3">Giờ hỗ trợ</h3>
              <p className="text-sm text-[#434654] leading-relaxed">
                24/7 mọi ngày trong tuần. RescueGuard luôn sẵn sàng cho các tình huống khẩn cấp và tư vấn dịch vụ.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Support;
