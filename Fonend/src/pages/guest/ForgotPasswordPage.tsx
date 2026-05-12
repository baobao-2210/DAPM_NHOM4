import { useState, type FormEvent } from 'react';
import { forgotPassword } from '../../services/guestService';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!emailOrPhone.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại.');
      return;
    }

    setSubmitting(true);
    const result = await forgotPassword({ emailOrPhone });
    setSubmitting(false);
    setMessage(result.message);
    setEmailOrPhone('');
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quên mật khẩu</h1>
          <p>Nhập email hoặc số điện thoại để nhận hướng dẫn đặt lại mật khẩu.</p>
        </div>
      </div>

      <form className="card" style={{ display: 'grid', gap: 20, maxWidth: 560 }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email hoặc số điện thoại</label>
          <input
            className="form-input"
            value={emailOrPhone}
            onChange={(event) => setEmailOrPhone(event.target.value)}
            placeholder="Nhập email hoặc số điện thoại"
          />
          {error && <span className="text-danger" style={{ fontSize: 13 }}>{error}</span>}
        </div>

        <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Gửi hướng dẫn'}
        </button>

        {message && <div style={{ color: 'var(--success)', fontSize: 14 }}>{message}</div>}
      </form>
    </div>
  );
}
