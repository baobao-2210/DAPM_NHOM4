import { MapPin, Navigation, Zap } from 'lucide-react';
import { mockRequests, mockStaff } from '../../data/mockData';

const statusClass: Record<string, string> = {
  pending: 'badge-warning', accepted: 'badge-info', dispatched: 'badge-info',
  in_progress: 'badge-primary', completed: 'badge-success', cancelled: 'badge-muted',
};
const statusLabel: Record<string, string> = {
  pending: 'Chờ Xử Lý', accepted: 'Đã Tiếp Nhận', dispatched: 'Đang Đến',
  in_progress: 'Đang Xử Lý', completed: 'Hoàn Thành', cancelled: 'Đã Hủy',
};

export default function MapPage() {
  const activeRequests = mockRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const availableStaff = mockStaff.filter(s => s.location);

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - var(--header-height) - 48px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-header-left">
          <h1>Bản Đồ Thực Tế</h1>
          <p>{activeRequests.length} yêu cầu đang hoạt động · {availableStaff.length} nhân viên có vị trí</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm"><Navigation size={14} /> Định Vị Tôi</button>
          <button className="btn btn-primary btn-sm"><Zap size={14} /> Tự Động Phân Công</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Map Placeholder */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,107,43,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,43,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
          {/* Simulated road lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
            <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
            <line x1="0%" y1="55%" x2="70%" y2="25%" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          </svg>
          {/* Mock pins */}
          {[
            { x: '35%', y: '42%', type: 'danger', label: '🚨' },
            { x: '65%', y: '38%', type: 'warning', label: '⚠️' },
            { x: '50%', y: '65%', type: 'success', label: '🔧' },
            { x: '25%', y: '55%', type: 'info', label: '🚗' },
            { x: '75%', y: '58%', type: 'info', label: '👷' },
          ].map((pin, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: pin.x, top: pin.y,
                transform: 'translate(-50%, -50%)',
                fontSize: 24,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                cursor: 'pointer',
                zIndex: 10,
                animation: `pulse 2s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              {pin.label}
            </div>
          ))}
          <div style={{ textAlign: 'center', zIndex: 5, color: 'var(--text-muted)', fontSize: 13 }}>
            <MapPin size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <div>Tích hợp Leaflet / Google Maps</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Cần API key để hiển thị bản đồ thực tế</div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <div className="card" style={{ flexShrink: 0 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Yêu Cầu Đang Xử Lý</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeRequests.slice(0, 4).map(req => (
                <div key={req.id} style={{
                  background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                  padding: '12px', border: '1px solid var(--border)', cursor: 'pointer'
                }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{req.customerName}</span>
                    <span className={`badge ${statusClass[req.status]}`} style={{ fontSize: 11 }}>{statusLabel[req.status]}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    <MapPin size={10} /> {req.location.address}
                  </div>
                  {req.assignedStaffName && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                      👷 {req.assignedStaffName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ flexShrink: 0 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Nhân Viên Có Vị Trí</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableStaff.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 13 }}>{s.name.charAt(0)}</div>
                    <span className={`status-dot ${s.status === 'available' ? 'online' : 'busy'}`}
                      style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, border: '2px solid var(--bg-card)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }} className="truncate">{s.location?.address}</div>
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
