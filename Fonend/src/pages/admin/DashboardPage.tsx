import {
  AlertTriangle, Users, CheckCircle, Clock, TrendingUp, TrendingDown,
  Car, Wrench, ArrowRight, MapPin, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDashboardStats, mockRequests, mockStaff } from '../../data/mockData';

const statusLabel: Record<string, string> = {
  pending: 'Chờ Xử Lý', accepted: 'Đã Tiếp Nhận', dispatched: 'Đang Đến',
  in_progress: 'Đang Xử Lý', completed: 'Hoàn Thành', cancelled: 'Đã Hủy',
};
const statusClass: Record<string, string> = {
  pending: 'badge-warning', accepted: 'badge-info', dispatched: 'badge-info',
  in_progress: 'badge-primary', completed: 'badge-success', cancelled: 'badge-muted',
};
const priorityClass: Record<string, string> = {
  low: 'badge-muted', medium: 'badge-info', high: 'badge-warning', critical: 'badge-danger',
};
const staffStatusClass: Record<string, string> = {
  available: 'online', busy: 'busy', offline: 'offline', on_break: 'busy',
};
const staffStatusLabel: Record<string, string> = {
  available: 'Sẵn Sàng', busy: 'Đang Bận', offline: 'Ngoại Tuyến', on_break: 'Nghỉ Giải Lao',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = mockDashboardStats;
  const recentRequests = mockRequests.slice(0, 5);
  const topStaff = mockStaff.slice(0, 4);

  const statCards = [
    {
      label: 'Tổng Yêu Cầu', value: stats.totalRequests.toLocaleString(),
      icon: AlertTriangle, color: 'var(--primary)', bg: 'rgba(255,107,43,0.12)',
      change: '+12%', trend: 'up',
    },
    {
      label: 'Đang Chờ Xử Lý', value: stats.pendingRequests,
      icon: Clock, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)',
      change: '-3', trend: 'down',
    },
    {
      label: 'Hoàn Thành Hôm Nay', value: stats.completedToday,
      icon: CheckCircle, color: 'var(--success)', bg: 'rgba(34,197,94,0.12)',
      change: '+8', trend: 'up',
    },
    {
      label: 'Nhân Viên Sẵn Sàng', value: `${stats.availableStaff}/${stats.totalStaff}`,
      icon: Users, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)',
      change: '+2', trend: 'up',
    },
    {
      label: 'Doanh Thu Tháng', value: formatCurrency(stats.totalRevenue).replace('₫', 'đ'),
      icon: TrendingUp, color: '#A855F7', bg: 'rgba(168,85,247,0.12)',
      change: '+18%', trend: 'up',
    },
    {
      label: 'T.Gian Phản Hồi TB', value: `${stats.avgResponseTime} phút`,
      icon: Car, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',
      change: '-2 phút', trend: 'down',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Xin chào, Admin 👋</h1>
          <p>Đây là tổng quan hoạt động hệ thống hỗ trợ xe hôm nay.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/requests')}>
          <AlertTriangle size={16} />
          Xem Yêu Cầu
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card" style={{ '--stat-color': s.color, '--stat-bg': s.bg } as React.CSSProperties}>
              <div className="stat-icon"><Icon size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-change ${s.trend}`}>
                  {s.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
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
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Yêu Cầu Gần Đây</div>
              <div className="card-subtitle">Các yêu cầu cứu hộ mới nhất</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/requests')}>
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Khách Hàng</th>
                  <th>Sự Cố</th>
                  <th>Địa Điểm</th>
                  <th>Ưu Tiên</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(req => (
                  <tr key={req.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/requests/${req.id}`)}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12 }}>
                          {req.customerName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{req.customerName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{req.vehiclePlate}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {req.problemType === 'flat_tire' && 'Nổ Lốp'}
                      {req.problemType === 'battery_dead' && 'Hết Bình'}
                      {req.problemType === 'fuel_empty' && 'Hết Xăng'}
                      {req.problemType === 'engine_failure' && 'Hỏng Máy'}
                      {req.problemType === 'towing' && 'Kéo Xe'}
                      {req.problemType === 'lockout' && 'Khóa Xe'}
                      {req.problemType === 'accident' && 'Tai Nạn'}
                      {req.problemType === 'other' && 'Khác'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1" style={{ fontSize: 12 }}>
                        <MapPin size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span className="truncate" style={{ maxWidth: 160 }}>{req.location.address}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${priorityClass[req.priority]}`}>{req.priority.toUpperCase()}</span></td>
                    <td><span className={`badge ${statusClass[req.status]}`}>{statusLabel[req.status]}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Staff Status */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Nhân Viên</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/staff')}>
                <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topStaff.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="avatar-placeholder" style={{ width: 38, height: 38, fontSize: 13, position: 'relative', flexShrink: 0 }}>
                    {s.name.charAt(0)}
                    <span
                      className={`status-dot ${staffStatusClass[s.status]}`}
                      style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, border: '2px solid var(--bg-card)' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }} className="truncate">{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{staffStatusLabel[s.status]}</div>
                  </div>
                  <div className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--accent)' }}>
                    <Star size={11} fill="currentColor" />
                    {s.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Trạng Thái Hệ Thống</div>
            {[
              { label: 'Yêu cầu đang xử lý', value: stats.activeRequests, color: 'var(--primary)' },
              { label: 'Yêu cầu chờ', value: stats.pendingRequests, color: 'var(--warning)' },
              { label: 'Nhân viên sẵn sàng', value: stats.availableStaff, color: 'var(--success)' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div className="flex justify-between" style={{ marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: item.color,
                    width: `${Math.min((item.value / 40) * 100, 100)}%`,
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
