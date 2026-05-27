import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';
import { Truck, Eye, EyeOff, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ROLE_REDIRECT = {
  admin: '/admin',
  staff: '/staff',
  customer: '/customer',
};

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@rescuecar.vn', password: '123456', color: 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/20 hover:bg-[#FEF2F2]/80' },
  { label: 'Nhân viên', email: 'staff@rescuecar.vn', password: '123456', color: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/20 hover:bg-[#EFF6FF]/80' },
  { label: 'Khách hàng', email: 'customer@rescuecar.vn', password: '123456', color: 'bg-[#F0FDF4] text-[#22C55E] border-[#22C55E]/20 hover:bg-[#F0FDF4]/80' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form);
      toast.success('Đăng nhập thành công!');
      const role = user.role?.toLowerCase();
      const redirect = location.state?.from?.pathname || ROLE_REDIRECT[role] || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
    toast.success(`Đã điền tài khoản ${account.label}`, { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8] flex items-center justify-center shadow-lg group-hover:bg-[#1E40AF] transition-colors">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-[#1D4ED8]">
              RescueCar
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-6 mb-2">Chào mừng trở lại!</h1>
          <p className="text-[#64748B]">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="email@example.com"
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#0F172A]">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1] pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              icon={LogIn}
              loading={loading}
              disabled={loading}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Demo accounts - collapsible section */}
          <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-center gap-2 text-[#64748B] text-sm hover:text-[#0F172A] transition-colors"
            >
              <span className="font-medium">Tài khoản demo</span>
              {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDemo && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => fillDemo(acc)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${acc.color}`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
                <p className="text-[#94A3B8] text-xs text-center">
                  Mật khẩu: <span className="text-[#0F172A] font-mono font-bold">123456</span>
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-[#64748B] text-sm mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#1D4ED8] hover:text-[#1E40AF] font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
