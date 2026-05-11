import { mockServices } from '../../data/mockData';
import { Check, Star, Zap } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ServicesPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Gói Dịch Vụ</h1>
          <p>Các gói hỗ trợ xe khẩn cấp dành cho khách hàng.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 960, margin: '0 auto' }}>
        {mockServices.map(svc => (
          <div
            key={svc.id}
            className="card"
            style={{
              textAlign: 'center',
              position: 'relative',
              border: svc.isPopular ? '2px solid var(--primary)' : '1px solid var(--border)',
              transform: svc.isPopular ? 'scale(1.03)' : 'none',
              boxShadow: svc.isPopular ? 'var(--shadow-glow)' : 'none',
            }}
          >
            {svc.isPopular && (
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white', padding: '4px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <Star size={11} fill="currentColor" /> Phổ Biến Nhất
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: svc.isPopular ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: svc.isPopular ? '0 8px 24px var(--primary-glow)' : 'none'
              }}>
                <Zap size={24} color={svc.isPopular ? 'white' : 'var(--text-muted)'} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Gói {svc.name}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{svc.description}</p>
            </div>

            <div style={{ margin: '24px 0' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: svc.isPopular ? 'var(--primary)' : 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {formatCurrency(svc.price)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>mỗi tháng</div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              {svc.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2" style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button className={`btn w-full ${svc.isPopular ? 'btn-primary btn-lg' : 'btn-secondary'}`}>
              {svc.isPopular ? '⚡ Chọn Gói Này' : 'Chọn Gói'}
            </button>
          </div>
        ))}
      </div>

      {/* Duration info */}
      <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--text-muted)', fontSize: 13 }}>
        * Thời gian xử lý tại chỗ tối đa: Cơ Bản 30 phút · Nâng Cao 60 phút · Cao Cấp 120 phút
      </div>
    </div>
  );
}
