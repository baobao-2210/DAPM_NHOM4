import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dịch vụ', to: '/services' },
  { label: 'Đăng nhập', to: '/login' },
  { label: 'Đăng ký', to: '/register' },
  { label: 'Quên mật khẩu', to: '/forgot-password' },
];

export default function GuestHeader() {
  const location = useLocation();

  return (
    <header className="card guest-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      margin: '0 auto',
      maxWidth: 1200,
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-strong)',
      background: 'rgba(19, 22, 30, 0.9)',
      backdropFilter: 'blur(16px)',
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <Link to="/" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'grid', placeItems: 'center', boxShadow: '0 8px 18px rgba(255,107,43,0.25)' }}>
          <span style={{ color: 'white', fontWeight: 800 }}>R</span>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>RescueVN</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hỗ trợ cứu hộ 24/7</div>
        </div>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {navItems.map((item) => {
          const active = item.to === '/' ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
