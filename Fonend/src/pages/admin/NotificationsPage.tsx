import { mockNotifications } from '../../data/mockData';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const typeIcon = {
  danger: <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />,
  success: <CheckCircle size={16} style={{ color: 'var(--success)' }} />,
  warning: <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />,
  info: <Info size={16} style={{ color: 'var(--info)' }} />,
};
const typeBg = {
  danger: 'rgba(239,68,68,0.08)', success: 'rgba(34,197,94,0.08)',
  warning: 'rgba(245,158,11,0.08)', info: 'rgba(59,130,246,0.08)',
};
function formatTime(str: string) {
  return new Date(str).toLocaleString('vi-VN');
}

export default function NotificationsPage() {
  const unread = mockNotifications.filter(n => !n.isRead);
  const read = mockNotifications.filter(n => n.isRead);
  return (
    <div className="animate-fade-in" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Thông Báo</h1>
          <p>{unread.length} thông báo chưa đọc</p>
        </div>
        <button className="btn btn-secondary">
          <CheckCheck size={15} /> Đánh dấu tất cả đã đọc
        </button>
      </div>

      {unread.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>
            Chưa Đọc ({unread.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unread.map(n => (
              <div key={n.id} className="card" style={{ padding: '16px 20px', background: typeBg[n.type], border: `1px solid rgba(255,255,255,0.06)` }}>
                <div className="flex items-center gap-12">
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {typeIcon[n.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{n.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{formatTime(n.createdAt)}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>
            Đã Đọc ({read.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {read.map(n => (
              <div key={n.id} className="card" style={{ padding: '16px 20px', opacity: 0.6 }}>
                <div className="flex items-center gap-12">
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {typeIcon[n.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{n.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{formatTime(n.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mockNotifications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <div>Không có thông báo nào</div>
        </div>
      )}
    </div>
  );
}
