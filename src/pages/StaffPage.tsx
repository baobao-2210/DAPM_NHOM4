import { useState } from 'react';
import { Search, Plus, Star, Phone, Mail, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { mockStaff } from '../data/mockData';
import type { StaffStatus } from '../types';

const statusLabel: Record<StaffStatus, string> = {
  available: 'Sẵn Sàng', busy: 'Đang Bận', offline: 'Ngoại Tuyến', on_break: 'Nghỉ Giải Lao',
};
const statusDot: Record<StaffStatus, string> = {
  available: 'online', busy: 'busy', offline: 'offline', on_break: 'busy',
};
const statusBadge: Record<StaffStatus, string> = {
  available: 'badge-success', busy: 'badge-warning', offline: 'badge-muted', on_break: 'badge-warning',
};

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = mockStaff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      || s.phone.includes(search)
      || s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = {
    all: mockStaff.length,
    available: mockStaff.filter(s => s.status === 'available').length,
    busy: mockStaff.filter(s => s.status === 'busy').length,
    offline: mockStaff.filter(s => s.status === 'offline').length,
    on_break: mockStaff.filter(s => s.status === 'on_break').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quản Lý Nhân Viên</h1>
          <p>Theo dõi trạng thái và hiệu suất của đội ngũ cứu hộ.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> Thêm Nhân Viên</button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'Tất Cả' },
          { key: 'available', label: '🟢 Sẵn Sàng' },
          { key: 'busy', label: '🟡 Đang Bận' },
          { key: 'on_break', label: '🟡 Nghỉ Giải Lao' },
          { key: 'offline', label: '⚫ Ngoại Tuyến' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn btn-sm ${filterStatus === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
            <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '1px 7px', fontSize: 11 }}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div className="search-bar" style={{ minWidth: 0 }}>
          <Search size={15} />
          <input placeholder="Tìm theo tên, số điện thoại, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(staff => (
          <div key={staff.id} className="card" style={{ cursor: 'pointer' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <div className="avatar-placeholder" style={{ width: 52, height: 52, fontSize: 18 }}>
                  {staff.name.charAt(0)}
                </div>
                <span
                  className={`status-dot ${statusDot[staff.status]}`}
                  style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, border: '2px solid var(--bg-card)' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{staff.name}</div>
                <span className={`badge ${statusBadge[staff.status]}`} style={{ marginTop: 4 }}>
                  {statusLabel[staff.status]}
                </span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>
                <Star size={14} fill="currentColor" />
                {staff.rating}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {staff.phone}
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {staff.email}
              </div>
              {staff.location && (
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {staff.location.address}
                </div>
              )}
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Briefcase size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {staff.specialization.join(', ')}
              </div>
            </div>

            <div className="divider" />

            <div className="flex justify-between" style={{ fontSize: 13 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Đã Hoàn Thành</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 18 }}>{staff.totalCompleted}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Đánh Giá</div>
                <div className="flex items-center gap-1" style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 18 }}>
                  <Star size={14} fill="currentColor" /> {staff.rating}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Trạng Thái</div>
                <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                  <span className={`status-dot ${statusDot[staff.status]}`} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{statusLabel[staff.status]}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2" style={{ marginTop: 14 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Xem Chi Tiết</button>
              {staff.status === 'available' && (
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <CheckCircle size={13} /> Phân Công
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
