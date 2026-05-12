import { Link } from 'react-router-dom';
import type { ServicePackage } from '../../types';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ServiceCard({ service }: { service: ServicePackage }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 260 }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)' }} />
          <span className="text-secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Dịch vụ</span>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{service.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, minHeight: 46 }}>{service.description}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{formatCurrency(service.price)}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Tham khảo</div>
        </div>
        <Link to={`/services/${service.id}`} className="btn btn-primary btn-sm">
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
