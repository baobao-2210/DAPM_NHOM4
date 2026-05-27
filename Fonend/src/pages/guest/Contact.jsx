import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Tin nhắn đã được gửi thành công!');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: Phone, title: 'Điện thoại', desc: '1900 1234', sub: 'Hỗ trợ 24/7' },
    { icon: Mail, title: 'Email', desc: 'support@rescuecar.vn', sub: 'Phản hồi trong 24h' },
    { icon: MapPin, title: 'Văn phòng', desc: '123 Đường ABC, Quận X', sub: 'TP. Hồ Chí Minh' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <section className="bg-[#1D4ED8] py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Liên hệ với <span className="text-[#FBBF24]">chúng tôi</span></h1>
          <p className="text-lg text-[#EFF6FF] opacity-90">
            Mọi thắc mắc, góp ý xin vui lòng gửi cho chúng tôi. Đội ngũ RescueCar luôn lắng nghe.
          </p>
        </div>
      </section>

      {/* Content — 2 columns: form left, contact cards right */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form (left, spans 2 cols) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-[#E2E8F0] shadow-sm">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ tên"
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <Textarea
                  label="Nội dung"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Bạn cần hỗ trợ gì?"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  fullWidth
                  icon={Send}
                  loading={sending}
                  disabled={sending}
                >
                  Gửi tin nhắn
                </Button>
              </form>
            </div>
          </div>

          {/* Info Cards (right) */}
          <div className="space-y-6 order-1 lg:order-2">
            {contactInfo.map(({ icon: Icon, title, desc, sub }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#1D4ED8]" />
                </div>
                <div>
                  <h3 className="text-[#0F172A] font-bold text-lg mb-1">{title}</h3>
                  <p className="text-[#1D4ED8] font-medium mb-1">{desc}</p>
                  <p className="text-[#94A3B8] text-sm">{sub}</p>
                </div>
              </div>
            ))}

            {/* Extra CTA card */}
            <div className="bg-[#1D4ED8] p-6 rounded-2xl text-white">
              <h3 className="font-bold text-lg mb-2">Cần hỗ trợ khẩn cấp?</h3>
              <p className="text-white/80 text-sm mb-4">Gọi ngay hotline để được hỗ trợ nhanh nhất.</p>
              <a
                href="tel:19001234"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBBF24] text-[#0F172A] font-semibold rounded-xl hover:bg-[#F59E0B] transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Gọi 1900 1234
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
