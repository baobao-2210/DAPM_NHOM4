import React from 'react';
import { HelpCircle, Phone, Mail, MessageSquare, ChevronRight } from 'lucide-react';

const Support = () => {
  const supportChannels = [
    {
      icon: <Phone className="text-blue-600" size={32} />,
      title: "Hotline 24/7",
      desc: "Gọi ngay khi bạn cần cứu hộ khẩn cấp.",
      action: "1900 1234",
      color: "bg-blue-50"
    },
    {
      icon: <MessageSquare className="text-amber-600" size={32} />,
      title: "Chat trực tuyến",
      desc: "Hỗ trợ kỹ thuật và giải đáp thắc mắc.",
      action: "Bắt đầu chat",
      color: "bg-amber-50"
    },
    {
      icon: <Mail className="text-emerald-600" size={32} />,
      title: "Email hỗ trợ",
      desc: "Gửi yêu cầu hỗ trợ qua hòm thư điện tử.",
      action: "support@rescueguard.vn",
      color: "bg-emerald-50"
    }
  ];

  const faqs = [
    "Làm thế nào để yêu cầu cứu hộ?",
    "Thời gian chờ đợi trung bình là bao lâu?",
    "Tôi có thể thanh toán bằng những phương thức nào?",
    "Làm sao để theo dõi vị trí xe cứu hộ?",
    "Chính sách bảo hiểm tài sản như thế nào?"
  ];

  return (
    <div className="bg-[var(--bg-body)] min-h-screen pt-24 pb-32">
      <main className="max-w-4xl mx-auto px-6 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[var(--text-main)] mb-4">Chúng tôi có thể giúp gì cho bạn?</h1>
          <p className="text-[var(--text-sub)] font-medium text-lg">Đội ngũ RescueGuard luôn sẵn sàng hỗ trợ bạn 24/7 trên mọi cung đường.</p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportChannels.map((channel, idx) => (
            <div key={idx} className="card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-[var(--primary)] transition-all">
              <div className={`w-16 h-16 ${channel.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {channel.icon}
              </div>
              <h3 className="font-black text-xl mb-2">{channel.title}</h3>
              <p className="text-sm text-[var(--text-muted)] font-medium mb-4">{channel.desc}</p>
              <span className="text-[var(--primary)] font-black uppercase tracking-widest text-xs">{channel.action}</span>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className="card p-8">
          <h2 className="font-black text-2xl mb-8 flex items-center gap-3">
            <HelpCircle className="text-[var(--primary)]" />
            Câu hỏi thường gặp
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {faqs.map((faq, idx) => (
              <button key={idx} className="w-full flex items-center justify-between py-5 text-left group">
                <span className="font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{faq}</span>
                <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        {/* Contact Form Placeholder */}
        <section className="mt-12 text-center">
          <p className="text-[var(--text-muted)] font-medium mb-6">Bạn vẫn còn thắc mắc khác?</p>
          <button className="btn btn-primary px-12 py-4 shadow-xl">Gửi yêu cầu hỗ trợ</button>
        </section>
      </main>
    </div>
  );
};

export default Support;
