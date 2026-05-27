import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck, User, Lock, Zap, Car, Wrench, Star,
  Phone, MapPin, CheckCircle, Clock, ArrowRight, Eye, EyeOff,
} from 'lucide-react';

// ── Services showcase ─────────────────────────────────────────
const services = [
  {
    icon: <Car size={32} />,
    title: 'Kéo xe & Cứu hộ',
    desc: 'Xe sàn trượt thủy lực hiện đại, hỗ trợ Sedan, SUV, xe tải nhẹ trong mọi điều kiện.',
    badge: 'Phổ biến nhất',
    badgeColor: 'bg-[var(--accent)] text-amber-900',
  },
  {
    icon: <Zap size={32} />,
    title: 'Cứu hộ tại chỗ',
    desc: 'Sửa chữa, thay lốp, nổ bình ngay tại nơi xảy ra sự cố — không cần kéo về xưởng.',
    badge: 'Nhanh nhất',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Bảo vệ toàn diện',
    desc: 'Gói bảo hiểm tài sản 100%, theo dõi lộ trình theo thời gian thực, báo cáo minh bạch.',
    badge: 'An toàn',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
];

const stats = [
  { value: '1,248+', label: 'Lượt cứu hộ' },
  { value: '< 15 phút', label: 'Thời gian phản hồi' },
  { value: '99%', label: 'Khách hàng hài lòng' },
  { value: '24/7', label: 'Hỗ trợ liên tục' },
];

const steps = [
  { num: '01', title: 'Đặt yêu cầu', desc: 'Gửi vị trí và mô tả sự cố qua app chỉ trong 1 phút.' },
  { num: '02', title: 'Điều phối ngay', desc: 'Hệ thống tự động chọn xe cứu hộ gần nhất.' },
  { num: '03', title: 'Nhân viên đến', desc: 'Theo dõi lộ trình nhân viên trực tiếp trên bản đồ.' },
  { num: '04', title: 'Hoàn tất', desc: 'Đánh giá dịch vụ và nhận hóa đơn điện tử.' },
];

// ── Demo accounts hint ────────────────────────────────────────
const demoAccounts = [
  { role: 'Khách hàng', user: 'customer', pass: 'customer123', color: 'bg-[var(--primary)]' },
  { role: 'Nhân viên', user: 'staff', pass: 'staff123', color: 'bg-teal-600' },
  { role: 'Admin', user: 'admin', pass: 'admin123', color: 'bg-violet-600' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!account.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.'); return;
    }
    setLoading(true);
    const result = await login(account.trim(), password);
    setLoading(false);

    if (result.success) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const role = JSON.parse(atob(token.split('.')[1])).role;
          if (role === 'admin') { navigate('/admin/dashboard'); return; }
          if (role === 'staff') { navigate('/partner'); return; }
        } catch {}
      }
      navigate('/detail');
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (user: string, pass: string) => {
    setAccount(user); setPassword(pass); setError('');
  };

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen">

      {/* ── HERO: split left/right ── */}
      <section className="min-h-screen grid lg:grid-cols-2">

        {/* LEFT — Marketing */}
        <div className="relative flex flex-col justify-between p-10 lg:p-16 bg-slate-900 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200"
              alt="rescue"
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/80 via-slate-900/70 to-slate-900" />
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-[var(--primary)]" size={28} />
            </div>
            <span className="font-black text-3xl text-white tracking-tight">RescueGuard</span>
          </div>

          {/* Main copy */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-white text-sm font-bold">Hệ thống cứu hộ 24/7</span>
            </div>

            <h1 className="font-black text-5xl lg:text-6xl text-white leading-[1.08] drop-shadow-lg">
              Sự an tâm<br />
              <span className="text-[var(--accent)]">trên mọi</span><br />
              cung đường.
            </h1>

            <p className="text-white/75 text-lg leading-relaxed max-w-md font-medium">
              RescueGuard cung cấp dịch vụ cứu hộ ô tô &amp; xe máy chuyên nghiệp,
              phản hồi trong <strong className="text-white">15 phút</strong>, bảo đảm tài sản 100%.
            </p>

            {/* Stats mini */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                  <div className="font-black text-2xl text-[var(--accent)]">{s.value}</div>
                  <div className="text-white/65 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 pt-2">
              <a
                href="tel:19006666"
                className="flex items-center gap-2 bg-[var(--accent)] text-amber-900 font-black px-6 py-3 rounded-full shadow-xl hover:opacity-90 transition-all active:scale-95"
              >
                <Phone size={18} /> 1900-6666
              </a>
              <button
                onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-white/15 border border-white/25 text-white font-bold px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/25 transition-all lg:hidden"
              >
                Đăng nhập <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10 flex items-center gap-3 pt-8 border-t border-white/10">
            <MapPin size={16} className="text-white/50" />
            <span className="text-white/50 text-sm font-bold">Phủ sóng toàn quốc — Đà Nẵng, HCM, Hà Nội...</span>
          </div>
        </div>

        {/* RIGHT — Auth form */}
        <div id="login-form" className="flex flex-col justify-center p-10 lg:p-16 bg-white">
          <div className="max-w-md w-full mx-auto">

            {/* Tab switcher */}
            <div className="flex p-1.5 bg-[var(--border)] rounded-2xl mb-10 w-fit shadow-inner">
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`px-8 py-2.5 rounded-xl transition-all font-black text-sm ${isLogin ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'}`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`px-8 py-2.5 rounded-xl transition-all font-black text-sm ${!isLogin ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'}`}
              >
                Đăng ký
              </button>
            </div>

            <h2 className="font-black text-4xl mb-2 text-[var(--text-main)]">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-8">
              {isLogin ? 'Đăng nhập để yêu cầu cứu hộ và theo dõi xe.' : 'Đăng ký miễn phí để sử dụng dịch vụ cứu hộ.'}
            </p>

            {/* Demo quick-fill */}
            {isLogin && (
              <div className="flex gap-2 mb-6">
                {demoAccounts.map((d) => (
                  <button
                    key={d.user}
                    type="button"
                    onClick={() => fillDemo(d.user, d.pass)}
                    className={`flex-1 py-2 rounded-xl text-white text-xs font-black transition-all active:scale-95 hover:opacity-90 ${d.color} ${account === d.user ? 'ring-2 ring-offset-2 ring-[var(--primary)]' : ''}`}
                  >
                    {d.role}
                  </button>
                ))}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-500 text-sm font-semibold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest ml-1">
                  {isLogin ? 'Tài khoản' : 'Họ và tên'}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                  <input
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[var(--bg-body)] border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]"
                    placeholder={isLogin ? 'Email, SĐT hoặc username' : 'Nhập họ và tên'}
                    type="text"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-body)] border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]"
                      placeholder="email@example.com"
                      type="email"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest ml-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-[var(--bg-body)] border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]"
                    placeholder="••••••••"
                    type={showPwd ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-[var(--primary)] font-bold hover:underline">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-4 rounded-full font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            {isLogin && (
              <div className="mt-6 p-4 bg-[var(--bg-body)] rounded-2xl border border-dashed border-[var(--border-strong)]">
                <p className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest mb-3">Tài khoản demo</p>
                <div className="space-y-2">
                  {demoAccounts.map((d) => (
                    <button
                      key={d.user}
                      type="button"
                      onClick={() => fillDemo(d.user, d.pass)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all hover:bg-white border ${account === d.user ? 'bg-white border-[var(--primary)]/30 shadow-sm' : 'border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${d.color} flex items-center justify-center`}>
                          <User size={14} className="text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black text-[var(--text-main)]">{d.role}</div>
                          <div className="text-xs text-[var(--text-muted)] font-medium">{d.user} / {d.pass}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-[var(--text-muted)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">Dịch vụ</span>
          <h2 className="font-black text-4xl mt-6 mb-4 text-[var(--text-main)]">Giải pháp cứu hộ toàn diện</h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto font-medium">
            Từ kéo xe khẩn cấp đến sửa chữa tại chỗ, RescueGuard có giải pháp phù hợp cho mọi tình huống.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-white rounded-[2rem] p-8 border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  {s.icon}
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
              </div>
              <h3 className="font-black text-xl mb-3 text-[var(--text-main)]">{s.title}</h3>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="bg-white/10 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">Quy trình</span>
            <h2 className="font-black text-4xl mt-6 mb-4 text-white">Chỉ 4 bước đơn giản</h2>
            <p className="text-white/60 text-lg font-medium">Yêu cầu cứu hộ nhanh chóng, theo dõi minh bạch</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-white/15 z-0" style={{ width: 'calc(100% - 2rem)', left: '100%' }} />
                )}
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 hover:bg-white/10 transition-all relative z-10">
                  <div className="font-black text-5xl text-white/10 mb-4">{step.num}</div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-4">
                    <CheckCircle size={20} className="text-amber-900" />
                  </div>
                  <h3 className="font-black text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-white/55 text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[var(--primary)] to-blue-700 rounded-[2rem] p-12 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              <span className="text-white/80 text-sm font-black uppercase tracking-widest ml-3">Sẵn sàng hỗ trợ ngay</span>
            </div>
            <h2 className="font-black text-4xl text-white mb-4">Cần cứu hộ khẩn cấp?</h2>
            <p className="text-white/70 text-lg mb-8 font-medium">
              Gọi hotline hoặc đăng nhập để tạo yêu cầu cứu hộ ngay lập tức
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19006666"
                className="flex items-center justify-center gap-3 bg-[var(--accent)] text-amber-900 font-black px-8 py-4 rounded-full shadow-xl hover:opacity-90 transition-all active:scale-95 text-lg"
              >
                <Phone size={22} /> Gọi 1900-6666
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center gap-3 bg-white/15 border border-white/25 text-white font-black px-8 py-4 rounded-full backdrop-blur-sm hover:bg-white/25 transition-all text-lg"
              >
                <Star size={20} /> Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <span className="font-black text-[var(--primary)]">RescueGuard</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-[var(--text-muted)]">
            <span className="flex items-center gap-2"><Clock size={14} /> 24/7</span>
            <span className="flex items-center gap-2"><Phone size={14} /> 1900-6666</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> Toàn quốc</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-bold">© 2026 RescueGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
