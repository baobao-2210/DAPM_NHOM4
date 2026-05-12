import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Truck, Zap, Lock, Phone } from 'lucide-react';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ staffId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    // Giả lập gọi API xác thực
    await new Promise(r => setTimeout(r, 900));

    // Mock: chấp nhận bất kỳ thông tin hợp lệ
    if (form.staffId.trim() && form.password.length >= 3) {
      localStorage.setItem('partner_session', JSON.stringify({
        staffId: form.staffId,
        loginTime: new Date().toISOString(),
        role: 'rescue_staff',
      }));
      navigate('/partner', { replace: true });
    } else {
      setError('Mã nhân viên hoặc mật khẩu không đúng.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0F14 0%, #111827 50%, #0F172A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(24, 28, 39, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        animation: 'fadeInUp 0.4s ease',
      }}>

        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 12px 32px rgba(29,78,216,0.4)',
          }}>
            <Truck size={34} color="white" />
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 800,
            color: '#F0F2F8',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: 6,
          }}>
            Cổng Nhân Viên Cứu Hộ
          </h1>
          <p style={{ color: '#5C6480', fontSize: 14 }}>
            Đăng nhập để truy cập hệ thống điều phối
          </p>
        </div>

        {/* Feature badges */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { icon: <Shield size={12} />, label: 'Bảo mật' },
            { icon: <Zap size={12} />, label: 'Thời gian thực' },
            { icon: <Phone size={12} />, label: 'Hỗ trợ 24/7' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(29,78,216,0.1)',
              border: '1px solid rgba(29,78,216,0.2)',
              borderRadius: 100,
              padding: '4px 12px',
              fontSize: 12, fontWeight: 500,
              color: '#60A5FA',
            }}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12,
              color: '#F87171',
              fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Staff ID */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3BF', marginBottom: 8 }}>
              Mã nhân viên / Số điện thoại
            </label>
            <input
              id="staff-id-input"
              type="text"
              placeholder="Ví dụ: NV001 hoặc 0912 345 678"
              value={form.staffId}
              onChange={e => setForm({ ...form, staffId: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#F0F2F8',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#1D4ED8';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3BF', marginBottom: 8 }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="staff-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#F0F2F8',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1D4ED8';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.2)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#5C6480', display: 'flex', alignItems: 'center',
                  padding: 4,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9CA3BF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5C6480')}
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
            style={{
              width: '100%',
              padding: '14px',
              marginTop: 4,
              background: isLoading
                ? 'rgba(29,78,216,0.5)'
                : 'linear-gradient(135deg, #1D4ED8, #0EA5E9)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              fontSize: 15, fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(29,78,216,0.35)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(29,78,216,0.5)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isLoading ? 'none' : '0 8px 24px rgba(29,78,216,0.35)';
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
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
        <div style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#5C6480' }}>
            Gặp sự cố đăng nhập?{' '}
            <a href="tel:19001234" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>
              Liên hệ quản trị viên
            </a>
          </p>
          <p style={{ fontSize: 12, color: '#3D4262', marginTop: 8 }}>
            🔒 Kết nối an toàn · RescueOps v2.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #3D4262 !important; }
      `}</style>
    </div>
  );
}
