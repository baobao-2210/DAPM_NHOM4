import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, User, Lock } from 'lucide-react';

const Auth = ({ initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const result = await login(emailOrPhone, password);
      if (result.success) {
        const token = sessionStorage.getItem('access_token');
        if (token) {
          try {
            const role = JSON.parse(atob(token.split('.')[1])).role;
            if (role === 'admin') {
              navigate('/admin');
              return;
            }
            if (role === 'staff') {
              navigate('/partner');
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
        navigate('/detail');
      } else {
        setError(result.message);
      }
    } else {
      // Giả lập đăng ký
      navigate('/detail');
    }
  };

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl min-h-[700px] animate-fade-in border border-[var(--border)]">
        <section className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-slate-900/90 to-slate-900"></div>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-[var(--primary)]" size={32} />
            </div>
            <span className="font-black text-3xl text-white tracking-tight">RescueGuard</span>
          </div>
          <div className="relative z-10">
            <h1 className="font-black text-5xl text-white mb-6 leading-tight drop-shadow-md">
              {isLogin ? "Sự an tâm trên mọi cung đường." : "An toàn hơn cùng RescueGuard."}
            </h1>
          </div>
        </section>

        <section className="flex flex-col p-8 lg:p-16 justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="flex p-1.5 bg-[var(--border)] rounded-2xl mb-10 w-fit shadow-inner">
              <button onClick={() => setIsLogin(true)} className={`px-8 py-2.5 rounded-xl transition-all ${isLogin ? 'bg-white text-[var(--primary)] font-black shadow-sm' : 'text-[var(--text-sub)] font-bold hover:text-[var(--text-main)]'}`}>Đăng nhập</button>
              <button onClick={() => setIsLogin(false)} className={`px-8 py-2.5 rounded-xl transition-all ${!isLogin ? 'bg-white text-[var(--primary)] font-black shadow-sm' : 'text-[var(--text-sub)] font-bold hover:text-[var(--text-main)]'}`}>Đăng ký</button>
            </div>
            <h2 className="font-black text-3xl mb-10 text-[var(--text-main)]">{isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest ml-1">Tài khoản</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                  <input value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[var(--bg-body)] border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]" placeholder="Email hoặc số điện thoại" type="text" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest ml-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                  <input value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[var(--bg-body)] border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-semibold placeholder-[var(--text-muted)]" placeholder="••••••••" type="password" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full py-4 rounded-full font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 mt-4">
                {isLogin ? "Đăng nhập" : "Đăng ký ngay"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Auth;