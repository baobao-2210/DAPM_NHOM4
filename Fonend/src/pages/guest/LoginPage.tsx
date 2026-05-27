import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (!password.trim()) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email, password });
      toast.success('Đăng nhập thành công');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/partner');
      else navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '24px',
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: 420,
        padding: '32px',
        border: '1px solid var(--border-strong)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
          gap: 12,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 8px 18px rgba(255,107,43,0.25)',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 28 }}>R</span>
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}>Đăng Nhập RescueVN</h1>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            margin: 0,
          }}>Hỗ trợ cứu hộ xe 24/7</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                fontSize: 14,
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              Mật khẩu
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  width: '100%',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 13,
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 600,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '⏳ Đang đăng nhập...' : '🔓 Đăng Nhập'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-default)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
