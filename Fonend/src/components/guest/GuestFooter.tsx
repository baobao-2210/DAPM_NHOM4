import { Link } from 'react-router-dom';

export default function GuestFooter() {
  return (
    <footer className="card" style={{ marginTop: 40, maxWidth: 1200, borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ maxWidth: 520 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>RescueVN</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Hệ thống cứu hộ xe máy và ô tô 24/7, hỗ trợ khẩn cấp mọi lúc, mọi nơi.</p>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Liên kết nhanh</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/services" className="text-secondary">Dịch vụ</Link>
              <Link to="/register" className="text-secondary">Đăng ký</Link>
              <Link to="/forgot-password" className="text-secondary">Quên mật khẩu</Link>
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Hỗ trợ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="text-secondary">hotline: 1900-6666</span>
              <span className="text-secondary">email: support@rescue.vn</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
        © 2026 RescueVN. Hệ thống hỗ trợ cứu hộ xe khẩn cấp.
      </div>
    </footer>
  );
}
