import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { login, registerCustomer } from '../../services/guestService';

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
  defaultMode?: AuthMode;
  onClose: () => void;
  /** Sau khi đăng nhập thành công sẽ navigate về đâu */
  redirectTo?: string;
}

export default function AuthModal({ defaultMode = 'login', onClose, redirectTo = '/' }: AuthModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // login
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // register
  const [reg, setReg] = useState({
    fullName: '', email: '', phone: '',
    password: '', confirmPassword: '', address: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.'); return;
    }
    setLoading(true);
    const result = await login({ emailOrPhone, password });
    setLoading(false);
    if (result.success) {
      sessionStorage.setItem('user', JSON.stringify({ emailOrPhone, loginTime: new Date().toISOString() }));
      onClose();
      navigate(redirectTo);
    } else {
      setError(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!reg.fullName || !reg.email || !reg.phone || !reg.password) {
      setError('Vui lòng nhập đầy đủ thông tin.'); return;
    }
    if (reg.password !== reg.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.'); return;
    }
    setLoading(true);
    const result = await registerCustomer(reg);
    setLoading(false);
    if (result.success) { setSuccess(result.message); }
    else { setError(result.message); }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-in"
        style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: 460,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          padding: '28px 32px 24px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 34, height: 34,
              display: 'grid', placeItems: 'center',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <X size={17} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: 'var(--accent)', display: 'grid', placeItems: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: 22, color: 'var(--accent-text)' }}>R</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: 'Manrope, sans-serif' }}>RescueVN</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Hỗ trợ cứu hộ xe 24/7</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {(['login', 'register'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: 12,
                  cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  background: mode === m ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: mode === m ? 'var(--primary)' : '#fff',
                }}
              >
                {m === 'login' ? '🔑 Đăng nhập' : '✨ Đăng ký'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={50} color="var(--success)" style={{ margin: '0 auto 14px' }} />
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-main)', marginBottom: 6 }}>Đăng ký thành công!</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{success}</div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => { setSuccess(''); setMode('login'); }}
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 12, padding: '12px 16px',
                  color: '#ef4444', fontSize: 14, marginBottom: 18,
                }}>
                  {error}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label className="form-label">Email hoặc số điện thoại</label>
                    <input className="form-input" placeholder="Nhập email / SĐT" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label className="form-label">Mật khẩu</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="form-input"
                        style={{ width: '100%', paddingRight: 48, boxSizing: 'border-box' }}
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        style={{
                          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                        }}
                      >
                        {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Link to="/forgot-password" onClick={onClose} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 15 }}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    Chưa có tài khoản?{' '}
                    <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                      Đăng ký ngay
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label className="form-label">Họ tên *</label>
                      <input className="form-input" placeholder="Nguyễn Văn A" value={reg.fullName} onChange={(e) => setReg({ ...reg, fullName: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label className="form-label">Số điện thoại *</label>
                      <input className="form-input" placeholder="0901234567" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="email@example.com" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label className="form-label">Mật khẩu *</label>
                      <input className="form-input" type="password" placeholder="••••••••" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label className="form-label">Xác nhận *</label>
                      <input className="form-input" type="password" placeholder="••••••••" value={reg.confirmPassword} onChange={(e) => setReg({ ...reg, confirmPassword: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="form-label">Địa chỉ</label>
                    <input className="form-input" placeholder="Số nhà, đường, quận, thành phố" value={reg.address} onChange={(e) => setReg({ ...reg, address: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}>
                    {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                  </button>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    Đã có tài khoản?{' '}
                    <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                      Đăng nhập
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
