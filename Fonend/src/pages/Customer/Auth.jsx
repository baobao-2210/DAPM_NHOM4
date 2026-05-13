import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
        const token = localStorage.getItem('access_token');
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
    <div className="bg-[#f8f9fb] font-['Inter'] text-[#191c1e] min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl min-h-[700px]">
        <section className="relative hidden lg:flex flex-col justify-between p-12 bg-[#003fb1]">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#003fb1] via-[#003fb1]/80 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[#003fb1] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            </div>
            <span className="font-['Manrope'] font-black text-3xl text-white">RescueGuard</span>
          </div>
          <div className="relative z-10">
            <h1 className="font-['Manrope'] font-extrabold text-5xl text-white mb-6 leading-tight">
              {isLogin ? "Sự an tâm trên mọi cung đường." : "An toàn hơn cùng RescueGuard."}
            </h1>
          </div>
        </section>

        <section className="flex flex-col p-8 lg:p-16 justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex p-1 bg-[#edeef0] rounded-2xl mb-10 w-fit">
              <button onClick={() => setIsLogin(true)} className={`px-8 py-2 rounded-xl transition-all ${isLogin ? 'bg-white text-[#003fb1] font-bold shadow-sm' : 'text-[#434654]'}`}>Đăng nhập</button>
              <button onClick={() => setIsLogin(false)} className={`px-8 py-2 rounded-xl transition-all ${!isLogin ? 'bg-white text-[#003fb1] font-bold shadow-sm' : 'text-[#434654]'}`}>Đăng ký</button>
            </div>
            <h2 className="font-['Manrope'] font-bold text-3xl mb-10">{isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#434654]">Tài khoản</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]">person</span>
                  <input value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#f3f4f6] border-0 rounded-2xl outline-none" placeholder="Email hoặc số điện thoại" type="text" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#434654]">Mật khẩu</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]">lock</span>
                  <input value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#f3f4f6] border-0 rounded-2xl outline-none" placeholder="••••••••" type="password" required />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-[#003fb1] text-white rounded-full font-bold text-lg hover:bg-[#1a56db] transition-all">
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