import { useState } from 'react';
import { Search, Filter, Plus, Eye, CheckCircle, XCircle, MapPin, Phone, Clock, AlertTriangle, Truck } from 'lucide-react';
import { mockRequests } from '../../data/mockData';
import type { RescueRequest, RequestStatus } from '../../types';

const problemLabels: Record<string, string> = {
  flat_tire: '🔧 Nổ Lốp', battery_dead: '🔋 Hết Bình', fuel_empty: '⛽ Hết Xăng',
  engine_failure: '⚙️ Hỏng Máy', accident: '🚨 Tai Nạn', towing: '🚛 Kéo Xe',
  lockout: '🔑 Khóa Xe', other: '❓ Khác',
};
const statusLabels: Record<RequestStatus, string> = {
  pending: 'Chờ Xử Lý', accepted: 'Đã Tiếp Nhận', dispatched: 'Đang Đến',
  in_progress: 'Đang Xử Lý', completed: 'Hoàn Thành', cancelled: 'Đã Hủy',
};
const statusClass: Record<RequestStatus, string> = {
  pending: 'badge-warning', accepted: 'badge-info', dispatched: 'badge-info',
  in_progress: 'badge-primary', completed: 'badge-success', cancelled: 'badge-muted',
};
const priorityClass: Record<string, string> = {
  low: 'badge-muted', medium: 'badge-info', high: 'badge-warning', critical: 'badge-danger',
};
const priorityLabel: Record<string, string> = {
  low: 'Thấp', medium: 'Trung Bình', high: 'Cao', critical: 'Khẩn Cấp',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}
function formatTime(str: string) {
  return new Date(str).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

export default function RequestsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selected, setSelected] = useState<RescueRequest | null>(null);

  const filtered = mockRequests.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase())
      || r.vehiclePlate.toLowerCase().includes(search.toLowerCase())
      || r.location.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchPriority = filterPriority === 'all' || r.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const countByStatus = (s: string) => mockRequests.filter(r => r.status === s).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quản Lý Yêu Cầu Cứu Hộ</h1>
          <p>Theo dõi và xử lý tất cả yêu cầu hỗ trợ xe từ khách hàng.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Tạo Yêu Cầu Mới
        </button>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Tất Cả', count: mockRequests.length },
          { key: 'pending', label: 'Chờ Xử Lý', count: countByStatus('pending') },
          { key: 'in_progress', label: 'Đang Xử Lý', count: countByStatus('in_progress') },
          { key: 'dispatched', label: 'Đang Đến', count: countByStatus('dispatched') },
          { key: 'completed', label: 'Hoàn Thành', count: countByStatus('completed') },
          { key: 'cancelled', label: 'Đã Hủy', count: countByStatus('cancelled') },
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn btn-sm ${filterStatus === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
            <span style={{
              background: filterStatus === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
              borderRadius: 'var(--radius-full)',
              padding: '1px 7px', fontSize: 11, fontWeight: 700
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <Search size={15} />
            <input placeholder="Tìm khách hàng, biển số, địa điểm..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select
            className="form-input form-select"
            style={{ width: 'auto', minWidth: 160 }}
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="all">Tất Cả Ưu Tiên</option>
            <option value="critical">Khẩn Cấp</option>
            <option value="high">Cao</option>
            <option value="medium">Trung Bình</option>
            <option value="low">Thấp</option>
          </select>
          <button className="btn btn-secondary btn-sm">
            <Filter size={14} /> Lọc Thêm
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>Sự Cố</th>
                <th>Địa Điểm</th>
                <th>Nhân Viên</th>
                <th>Ưu Tiên</th>
                <th>Trạng Thái</th>
                <th>Chi Phí</th>
                <th>Thời Gian</th>
                <th style={{ textAlign: 'center' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  Không tìm thấy yêu cầu nào
                </td></tr>
              )}
              {filtered.map(req => (
                <tr key={req.id} style={{ cursor: 'pointer', background: selected?.id === req.id ? 'var(--bg-card-hover)' : undefined }}
                  onClick={() => setSelected(s => s?.id === req.id ? null : req)}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {req.customerName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{req.customerName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{req.vehiclePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{problemLabels[req.problemType]}</td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 12 }}>
                      <MapPin size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span className="truncate" style={{ maxWidth: 140 }}>{req.location.address}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {req.assignedStaffName
                      ? <span style={{ color: 'var(--text-primary)' }}>{req.assignedStaffName}</span>
                      : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa phân công</span>}
                  </td>
                  <td><span className={`badge ${priorityClass[req.priority]}`}>{priorityLabel[req.priority]}</span></td>
                  <td><span className={`badge ${statusClass[req.status]}`}>{statusLabels[req.status]}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                    {req.cost ? formatCurrency(req.cost) : '—'}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(req.createdAt)}</td>
                  <td>
                    <div className="flex items-center gap-1" style={{ justifyContent: 'center' }}>
                      <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={e => { e.stopPropagation(); setSelected(req); }}>
                        <Eye size={14} />
                      </button>
                      {req.status === 'pending' && (
                        <button className="btn btn-success btn-sm" style={{ padding: '4px 10px', fontSize: 12 }} onClick={e => e.stopPropagation()}>
                          <CheckCircle size={12} /> Tiếp Nhận
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="card animate-slide-up" style={{ height: 'fit-content', position: 'sticky', top: 88 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Chi Tiết Yêu Cầu</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{selected.id.toUpperCase()}</div>
              </div>
              <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={() => setSelected(null)}>
                <XCircle size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Customer */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Khách Hàng</div>
                <div className="flex items-center gap-3">
                  <div className="avatar-placeholder" style={{ width: 44, height: 44 }}>{selected.customerName.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selected.customerName}</div>
                    <div className="flex items-center gap-1" style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                      <Phone size={12} /> {selected.customerPhone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Vehicle */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Phương Tiện</div>
                <div className="flex items-center gap-2">
                  <Truck size={16} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selected.vehicleModel}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Biển số: {selected.vehiclePlate}</div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Problem */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Sự Cố</div>
                <div style={{ fontSize: 15 }}>{problemLabels[selected.problemType]}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{selected.description}</div>
              </div>

              <div className="divider" />

              {/* Location */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Địa Điểm</div>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {selected.location.address}
                </div>
              </div>

              <div className="divider" />

              {/* Status & Priority */}
              <div className="flex gap-2">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Trạng Thái</div>
                  <span className={`badge ${statusClass[selected.status]}`}>{statusLabels[selected.status]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Ưu Tiên</div>
                  <span className={`badge ${priorityClass[selected.priority]}`}>{priorityLabel[selected.priority]}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <Clock size={12} /> Tạo lúc: {formatTime(selected.createdAt)}
              </div>

              {selected.cost && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Chi Phí Dịch Vụ</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{formatCurrency(selected.cost)}</div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {selected.status === 'pending' && (
                  <button className="btn btn-primary w-full"><CheckCircle size={15} /> Tiếp Nhận & Phân Công</button>
                )}
                {(selected.status === 'accepted' || selected.status === 'dispatched') && (
                  <button className="btn btn-primary w-full"><AlertTriangle size={15} /> Cập Nhật Tiến Độ</button>
                )}
                <button className="btn btn-secondary w-full">Xem Trên Bản Đồ</button>
                {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                  <button className="btn btn-danger w-full"><XCircle size={15} /> Hủy Yêu Cầu</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
