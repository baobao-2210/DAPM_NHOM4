import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, PlayCircle } from 'lucide-react';

export default function GuestFooter() {
  return (
    <footer style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div style={{ padding: '48px 48px 32px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'grid', placeItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>R</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', fontFamily: 'Manrope, sans-serif' }}>RescueVN</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Cứu hộ xe 24/7</div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>
            Hệ thống cứu hộ xe máy và ô tô 24/7, hỗ trợ khẩn cấp mọi lúc, mọi nơi trên toàn quốc.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Share2, PlayCircle].map((Icon, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <Icon size={18} color="rgba(255,255,255,0.7)" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Liên kết nhanh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Trang chủ', to: '/' },
              { label: 'Dịch vụ cứu hộ', to: '/services' },
              { label: 'Đăng nhập', to: '/login' },
              { label: 'Đăng ký tài khoản', to: '/register' },
              { label: 'Quên mật khẩu', to: '/forgot-password' },
            ].map((item) => (
              <Link key={item.to} to={item.to} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Liên hệ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <Phone size={16} />, text: '1900-6666' },
              { icon: <Mail size={16} />, text: 'support@rescue.vn' },
              { icon: <MapPin size={16} />, text: 'Toàn quốc, 24/7' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>© 2026 RescueVN. All rights reserved.</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Hệ thống hỗ trợ cứu hộ xe khẩn cấp toàn quốc</span>
      </div>
    </footer>
  );
}
