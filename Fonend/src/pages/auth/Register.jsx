import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';
import { Truck, Eye, EyeOff, UserPlus } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success('Đăng ký thành công! Đang tự động đăng nhập...');
      
      try {
        await login({ email: form.email, password: form.password });
        navigate('/customer', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <span className="text-3xl font-bold text-[#1D4ED8]">RescueCar</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-6 mb-2">Tạo tài khoản mới</h1>
          <p className="text-[#64748B]">Trở thành thành viên để gọi cứu hộ nhanh chóng</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
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

            <Input
              label="Số điện thoại"
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="0901234567"
              required
            />

            {/* Password field with toggle */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#0F172A]">
                Mật khẩu <span className="text-[#EF4444] ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1] pr-12"
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

            {/* Confirm password field with toggle */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#0F172A]">
                Xác nhận mật khẩu <span className="text-[#EF4444] ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              icon={UserPlus}
              loading={loading}
              disabled={loading}
            >
              Đăng ký ngay
            </Button>
          </form>

          <p className="text-center text-[#64748B] text-sm mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#1D4ED8] hover:text-[#1E40AF] font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
