import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Họ tên không được bỏ trống.';
    if (!form.email.trim()) next.email = 'Email không được bỏ trống.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email không hợp lệ.';
    if (!form.phone.trim()) next.phone = 'Số điện thoại không được bỏ trống.';
    if (!form.password) next.password = 'Mật khẩu không được bỏ trống.';
    if (!form.confirmPassword) next.confirmPassword = 'Xác nhận mật khẩu không được bỏ trống.';
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) next.confirmPassword = 'Mật khẩu không khớp.';
    if (!form.address.trim()) next.address = 'Địa chỉ không được bỏ trống.';
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.fullName,
        phone: form.phone,
      });
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setForm(initialForm);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Đăng ký tài khoản khách hàng</h1>
          <p>Nhập thông tin để tạo tài khoản và nhận hỗ trợ cứu hộ nhanh chóng.</p>
        </div>
      </div>

      <form className="card" style={{ display: 'grid', gap: 20 }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Họ tên</label>
          <input
            className="form-input"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            placeholder="Nhập họ tên"
          />
          {errors.fullName && <span className="text-danger" style={{ fontSize: 13 }}>{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Nhập email"
          />
          {errors.email && <span className="text-danger" style={{ fontSize: 13 }}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input
            className="form-input"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <span className="text-danger" style={{ fontSize: 13 }}>{errors.phone}</span>}
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <span className="text-danger" style={{ fontSize: 13 }}>{errors.password}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              className="form-input"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && <span className="text-danger" style={{ fontSize: 13 }}>{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Địa chỉ</label>
          <input
            className="form-input"
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            placeholder="Nhập địa chỉ"
          />
          {errors.address && <span className="text-danger" style={{ fontSize: 13 }}>{errors.address}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  );
}
