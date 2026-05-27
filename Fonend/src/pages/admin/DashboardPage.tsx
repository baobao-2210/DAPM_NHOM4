import {
  AlertTriangle, Users, CheckCircle, Clock, TrendingUp, TrendingDown,
  Car, ArrowRight, MapPin, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDashboardStats, mockRequests, mockStaff } from '../../data/mockData';

const statusLabel: Record<string, string> = {
  pending: 'Chờ Xử Lý', accepted: 'Đã Tiếp Nhận', dispatched: 'Đang Đến',
  in_progress: 'Đang Xử Lý', completed: 'Hoàn Thành', cancelled: 'Đã Hủy',
};
const statusBadge: Record<string, string> = {
  pending: 'warning', accepted: 'info', dispatched: 'info',
  in_progress: 'primary', completed: 'success', cancelled: 'muted',
};
const priorityBadge: Record<string, string> = {
  low: 'muted', medium: 'info', high: 'warning', critical: 'danger',
};
const staffDot: Record<string, string> = {
  available: 'online', busy: 'busy', offline: 'offline', on_break: 'busy',
};
const staffStatusLabel: Record<string, string> = {
  available: 'Sẵn Sàng', busy: 'Đang Bận', offline: 'Ngoại Tuyến', on_break: 'Nghỉ',
};

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}
function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

const problemMap: Record<string, string> = {
  flat_tire: 'Nổ Lốp', battery_dead: 'Hết Bình', fuel_empty: 'Hết Xăng',
  engine_failure: 'Hỏng Máy', towing: 'Kéo Xe', lockout: 'Khóa Xe',
  accident: 'Tai Nạn', other: 'Khác',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = mockDashboardStats;
  const recentRequests = mockRequests.slice(0, 5);
  const topStaff = mockStaff.slice(0, 4);

  const statCards = [
    { label: 'Tổng Yêu Cầu', value: stats.totalRequests.toLocaleString(), icon: AlertTriangle, color: '#003fb1', bg: 'rgba(0,63,177,0.1)', change: '+12%', trend: 'up' },
    { label: 'Đang Chờ Xử Lý', value: stats.pendingRequests, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', change: '-3', trend: 'down' },
    { label: 'Hoàn Thành Hôm Nay', value: stats.completedToday, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', change: '+8', trend: 'up' },
    { label: 'Nhân Viên Sẵn Sàng', value: `${stats.availableStaff}/${stats.totalStaff}`, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', change: '+2', trend: 'up' },
    { label: 'Doanh Thu Tháng', value: fmtCurrency(stats.totalRevenue).replace('₫', 'đ'), icon: TrendingUp, color: '#a855f7', bg: 'rgba(168,85,247,0.1)', change: '+18%', trend: 'up' },
    { label: 'T.Gian Phản Hồi TB', value: `${stats.avgResponseTime} phút`, icon: Car, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', change: '-2 phút', trend: 'down' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb"><span>Hệ thống</span><span>/</span><span className="active">Dashboard</span></div>
          <h1 className="adm-page-title">Xin chào, Admin 👋</h1>
          <p className="adm-page-subtitle">Tổng quan hoạt động hệ thống hỗ trợ xe hôm nay.</p>
        </div>
        <button className="adm-btn primary" onClick={() => navigate('/admin/requests')}>
          <AlertTriangle size={15} /> Xem Yêu Cầu
        </button>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="adm-stat-card">
              <div className="adm-stat-icon" style={{ background: s.bg, color: s.color }}>
                <Icon size={22} />
              </div>
              <div>
                <div className="adm-stat-value">{s.value}</div>
                <div className="adm-stat-label">{s.label}</div>
                <div className={`adm-stat-trend ${s.trend}`}>
                  {s.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.change} so với hôm qua
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Recent Requests */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <div className="adm-card-title">Yêu Cầu Gần Đây</div>
              <div className="adm-card-subtitle">Các yêu cầu cứu hộ mới nhất</div>
            </div>
            <button className="adm-btn secondary sm" onClick={() => navigate('/admin/requests')}>
              Xem tất cả <ArrowRight size={13} />
            </button>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Khách Hàng</th><th>Sự Cố</th><th>Địa Điểm</th>
                  <th>Ưu Tiên</th><th>Trạng Thái</th><th>Thời Gian</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(req => (
                  <tr key={req.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/requests')}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="adm-avatar" style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#003fb1,#1e62e6)', fontSize: 12 }}>
                          {req.customerName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#191c1e', fontSize: 13 }}>{req.customerName}</div>
                          <div style={{ fontSize: 11, color: '#737686' }}>{req.vehiclePlate}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#191c1e', fontSize: 13 }}>{problemMap[req.problemType] || req.problemType}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <MapPin size={12} style={{ color: '#003fb1', flexShrink: 0 }} />
                        <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.location.address}</span>
                      </div>
                    </td>
                    <td><span className={`adm-badge ${priorityBadge[req.priority]}`}>{req.priority.toUpperCase()}</span></td>
                    <td><span className={`adm-badge ${statusBadge[req.status]}`}>{statusLabel[req.status]}</span></td>
                    <td style={{ fontSize: 12, color: '#737686' }}>{timeAgo(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Staff */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title">Nhân Viên</div>
              <button className="adm-btn ghost sm" onClick={() => navigate('/admin/staff')}>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="adm-card-body" style={{ paddingTop: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topStaff.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div className="adm-avatar" style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#003fb1,#3b82f6)', fontSize: 13 }}>
                        {s.name.split(' ').pop()?.[0]}
                      </div>
                      <span className={`adm-status-dot ${staffDot[s.status]}`} style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, border: '2px solid #f0f4ff', borderRadius: '999px', display: 'block' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#191c1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#737686' }}>{staffStatusLabel[s.status]}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#d97706' }}>
                      <Star size={11} fill="currentColor" /> {s.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title">Trạng Thái Hệ Thống</div>
            </div>
            <div className="adm-card-body" style={{ paddingTop: 16 }}>
              {[
                { label: 'Yêu cầu đang xử lý', value: stats.activeRequests, max: 40, color: '#003fb1' },
                { label: 'Yêu cầu chờ', value: stats.pendingRequests, max: 40, color: '#f59e0b' },
                { label: 'Nhân viên sẵn sàng', value: stats.availableStaff, max: stats.totalStaff, color: '#10b981' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: '#737686', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontWeight: 800, color: item.color }}>{item.value}</span>
                  </div>
                  <div className="adm-progress-bar">
                    <div className="adm-progress-fill" style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
