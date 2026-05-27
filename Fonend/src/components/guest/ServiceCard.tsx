import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ServicePackage } from '../../types';
import AuthModal from './AuthModal';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ServiceCard({ service }: { service: ServicePackage }) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      {showAuth && <AuthModal defaultMode="login" onClose={() => setShowAuth(false)} />}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 260 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary-soft)', borderRadius: 999, padding: '5px 12px', marginBottom: 12 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)' }} />
            <span style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Dịch vụ</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>{service.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, minHeight: 42 }}>{service.description}</p>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope, sans-serif' }}>{formatCurrency(service.price)}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Tham khảo</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to={`/services/${service.id}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              Xem chi tiết
            </Link>
            {/* YÊU CẦU → bắt đăng nhập */}
            <button
              className="btn btn-primary"
              onClick={() => setShowAuth(true)}
              style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
            >
              Yêu cầu ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
