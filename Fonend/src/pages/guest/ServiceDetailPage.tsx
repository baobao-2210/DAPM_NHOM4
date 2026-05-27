import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGuestServiceById, getGuestServices } from '../../services/guestService';
import type { ServicePackage } from '../../types';
import { ArrowRight, Sparkles, Phone, LogIn } from 'lucide-react';
import AuthModal from '../../components/guest/AuthModal';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<ServicePackage | undefined>();
  const [related, setRelated] = useState<ServicePackage[]>([]);
  const [showAuth, setShowAuth] = useState(false);

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
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: 'var(--text-main)', marginBottom: 8 }}>Dịch vụ không tồn tại</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Vui lòng thử lại hoặc quay lại danh sách dịch vụ.</p>
        <Link to="/services" className="btn btn-secondary">Quay lại dịch vụ</Link>
      </div>
    );
  }

  return (
    <>
      {showAuth && <AuthModal defaultMode="login" onClose={() => setShowAuth(false)} />}

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Page header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>{service.name}</h1>
            <p>{service.description}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* NÚT YÊU CẦU → bắt đăng nhập */}
            <button
              className="btn btn-primary"
              onClick={() => setShowAuth(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <LogIn size={16} />
              Yêu cầu dịch vụ này
            </button>
            <a href="tel:19006666" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Phone size={15} />
              Gọi cứu hộ
            </a>
          </div>
        </div>

        {/* Service info */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Thông tin dịch vụ</div>
              <div className="card-subtitle">Chi tiết quy trình và giá tham khảo.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Manrope, sans-serif' }}>
                {formatCurrency(service.price)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Giá tham khảo</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, fontFamily: 'Manrope, sans-serif' }}>Quy trình hỗ trợ</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {['Tiếp nhận yêu cầu', 'Phân công đội cứu hộ', 'Di chuyển đến hiện trường', 'Xử lý sự cố tại chỗ', 'Báo cáo và hoàn tất dịch vụ'].map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-body)', borderRadius: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                    </div>
                    <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, fontFamily: 'Manrope, sans-serif' }}>Điểm nổi bật</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {service.features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-sub)', fontSize: 14 }}>
                    <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 24, padding: '20px 24px', background: 'linear-gradient(135deg, var(--primary-soft), rgba(0,63,177,0.06))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', fontFamily: 'Manrope, sans-serif' }}>Sẵn sàng sử dụng dịch vụ này?</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 3 }}>Đăng nhập hoặc tạo tài khoản để yêu cầu cứu hộ ngay.</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowAuth(true)}
              style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <LogIn size={15} />
              Đăng nhập / Đăng ký
            </button>
          </div>
        </div>

        {/* Related services */}
        {related.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Dịch vụ liên quan</div>
                <div className="card-subtitle">Xem thêm các gói cứu hộ tương tự.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/services/${item.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', background: 'var(--bg-body)', borderRadius: 14, textDecoration: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-soft)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-body)'; }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{item.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 15 }}>{formatCurrency(item.price)}</span>
                    <ArrowRight size={15} color="var(--primary)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
