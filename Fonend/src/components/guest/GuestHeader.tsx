import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dịch vụ', to: '/services' },
];

export default function GuestHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(0,63,177,0.3)' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, fontFamily: 'Manrope, sans-serif' }}>R</span>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope, sans-serif', lineHeight: 1.1 }}>RescueVN</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Cứu hộ xe 24/7</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navLinks.map((item) => {
            const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} style={{
                padding: '8px 18px', borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
                background: active ? 'var(--primary-soft)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-sub)',
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="tel:19006666" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Phone size={15} />
            <span className="hide-mobile">1900-6666</span>
          </a>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 14, padding: '9px 20px', fontWeight: 700 }}>
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 14, padding: '9px 20px', fontWeight: 700 }}>
            Đăng ký
          </Link>
          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: 6 }} className="mobile-menu-btn">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '12px 24px 20px' }}>
          {navLinks.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {item.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Link to="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Đăng ký</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </header>
  );
}
