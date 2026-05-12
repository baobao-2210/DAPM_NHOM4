import { Link } from 'react-router-dom';
import { mockServices } from '../../data/mockData';
import { ArrowRight, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';
import ServiceCard from '../../components/guest/ServiceCard';

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export default function HomePage() {
  const featured = mockServices.slice(0, 3);

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <section className="card" style={{ padding: 32, display: 'grid', gap: 28, gridTemplateColumns: '1.4fr 1fr', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700, letterSpacing: 1.4 }}>RESCUEVN</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Hệ thống cứu hộ 24/7</span>
          </div>
          <h1 style={{ fontSize: 44, lineHeight: 1.03, marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cứu hộ xe nhanh chóng, an toàn trên mọi hành trình.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 540, marginBottom: 28 }}>RescueVN luôn sẵn sàng hỗ trợ khách hàng với dịch vụ cứu hộ ô tô và xe máy, đảm bảo tiếp cận nhanh và xử lý chuyên nghiệp 24 giờ mỗi ngày.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link to="/services" className="btn btn-primary btn-lg">Tìm dịch vụ cứu hộ</Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Đăng ký tài khoản</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(255,107,43,0.14), rgba(255,107,43,0.06))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--bg-card)', display: 'grid', placeItems: 'center' }}><Sparkles size={24} color="var(--primary)" /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Giới thiệu</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Hỗ trợ cứu hộ xe 24/7</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>RescueVN cung cấp dịch vụ cứu hộ nhanh, tư vấn chuyên sâu, và xử lý tai nạn hoặc sự cố xe với đội ngũ nhân viên chuyên nghiệp.</p>
          </div>
          <div className="card" style={{ padding: 20, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-strong)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: <Clock3 size={20} />, value: 1248, label: 'lượt cứu hộ' },
                { icon: <ShieldCheck size={20} />, value: 32, label: 'dịch vụ' },
                { icon: <ArrowRight size={20} />, value: 18, label: 'nhân viên hỗ trợ' },
              ].map((item) => (
                <div key={item.label} className="stat-card" style={{ padding: 20, borderRadius: 'var(--radius-lg)' }}>
                  <div className="stat-icon" style={{ background: 'rgba(255, 107, 43, 0.12)', color: 'var(--primary)' }}>{item.icon}</div>
                  <div className="stat-info">
                    <div className="stat-value">{formatNumber(item.value)}</div>
                    <div className="stat-label" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="page-header">
          <div className="page-header-left">
            <h1>Dịch vụ nổi bật</h1>
            <p>Chọn gói cứu hộ phù hợp với nhu cầu và mức độ ưu tiên cứu hộ của bạn.</p>
          </div>
          <Link to="/services" className="btn btn-secondary">Xem tất cả dịch vụ</Link>
        </div>
        <div className="grid-3" style={{ gap: 20 }}>
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
