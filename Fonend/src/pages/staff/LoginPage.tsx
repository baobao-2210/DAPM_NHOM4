import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Truck, Zap, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ staffId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.staffId.trim()) {
      setError('Vui lòng nhập mã nhân viên hoặc số điện thoại');
      return;
    }
    if (!form.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    const result = await login(form.staffId, form.password);
    setIsLoading(false);

    if (result.success) {
      const role = sessionStorage.getItem('access_token') ? JSON.parse(atob(sessionStorage.getItem('access_token')!.split('.')[1])).role : null;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/partner', { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Animated background blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,63,177,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(254,208,27,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white border border-[var(--border)] rounded-3xl p-10 shadow-2xl shadow-[var(--primary)]/5 animate-fade-in relative z-10">

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--primary)]/30">
            <Truck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">
            Cổng Nhân Viên Cứu Hộ
          </h1>
          <p className="text-[var(--text-sub)] text-sm font-medium">
            Đăng nhập để truy cập hệ thống điều phối
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {[
            { icon: <Shield size={12} />, label: 'Bảo mật' },
            { icon: <Zap size={12} />, label: 'Thời gian thực' },
            { icon: <Phone size={12} />, label: 'Hỗ trợ 24/7' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-3 py-1 text-xs font-bold text-[var(--primary)]">
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Staff ID */}
          <div>
            <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">
              Mã nhân viên / Số điện thoại
            </label>
            <input
              id="staff-id-input"
              type="text"
              placeholder="Ví dụ: NV001 hoặc 0912 345 678"
              value={form.staffId}
              onChange={e => setForm({ ...form, staffId: e.target.value })}
              className="w-full px-4 py-3.5 bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl text-[var(--text-main)] text-sm font-semibold outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 placeholder-[var(--text-muted)]/50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="staff-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-4 pr-11 py-3.5 bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl text-[var(--text-main)] text-sm font-semibold outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 placeholder-[var(--text-muted)]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="staff-login-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-2 rounded-2xl text-white text-base font-black flex items-center justify-center gap-2.5 transition-all
              ${isLoading 
                ? 'bg-[var(--primary)]/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[var(--primary)] to-blue-600 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5'
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <Lock size={18} />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center space-y-2">
          <p className="text-sm text-[var(--text-sub)] font-medium">
            Gặp sự cố đăng nhập?{' '}
            <a href="tel:19001234" className="text-[var(--primary)] font-black hover:underline">
              Liên hệ quản trị viên
            </a>
          </p>
          <p className="text-xs text-[var(--text-muted)] font-bold">
            🔒 Kết nối an toàn · RescueOps v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
