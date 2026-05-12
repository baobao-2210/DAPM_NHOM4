import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGuestServiceById, getGuestServices } from '../../services/guestService';
import type { ServicePackage } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<ServicePackage | undefined>();
  const [related, setRelated] = useState<ServicePackage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getGuestServiceById(id).then((found) => {
      setService(found);
      if (!found) return;
      getGuestServices().then((list) => {
        setRelated(list.filter((item) => item.id !== found.id).slice(0, 2));
      });
    });
  }, [id]);

  if (!service) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Dịch vụ không tồn tại</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>Vui lòng thử lại hoặc quay lại danh sách dịch vụ.</p>
        <Link to="/services" className="btn btn-secondary">Quay lại dịch vụ</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>{service.name}</h1>
          <p>{service.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Đăng ký để yêu cầu dịch vụ
          </button>
          <a href="tel:19006666" className="btn btn-secondary">Gọi cứu hộ</a>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Thông tin dịch vụ</div>
              <div className="card-subtitle">Chi tiết quy trình và giá tham khảo.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{formatCurrency(service.price)}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Giá tham khảo</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Quy trình hỗ trợ</h3>
              <ul style={{ display: 'grid', gap: 12, paddingLeft: 18, color: 'var(--text-secondary)' }}>
                {['Tiếp nhận yêu cầu', 'Phân công đội cứu hộ', 'Di chuyển đến hiện trường', 'Xử lý sự cố tại chỗ', 'Báo cáo và hoàn tất dịch vụ'].map((step) => (
                  <li key={step} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Điểm nổi bật</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {service.features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                    <Sparkles size={18} color="var(--primary)" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Dịch vụ liên quan</div>
              <div className="card-subtitle">Xem thêm các gói cứu hộ tương tự.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {related.map((item) => (
              <Link key={item.id} to={`/services/${item.id}`} className="card" style={{ display: 'block', border: '1px solid var(--border)', background: 'var(--bg-card)', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.description}</div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(item.price)}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
