import { useState } from 'react';
import { Search, Plus, Car, Bike } from 'lucide-react';
import { mockVehicles } from '../../data/mockData';

const typeIcon: Record<string, React.ReactNode> = {
  car: <Car size={18} />, motorcycle: <Bike size={18} />, truck: <Car size={18} />, bus: <Car size={18} />,
};
const typeLabel: Record<string, string> = {
  car: 'Ô Tô', motorcycle: 'Xe Máy', truck: 'Xe Tải', bus: 'Xe Buýt',
};
const statusLabel: Record<string, string> = {
  active: 'Hoạt Động', in_service: 'Đang Sửa Chữa', inactive: 'Không Hoạt Động',
};
const statusBadge: Record<string, string> = {
  active: 'badge-success', in_service: 'badge-warning', inactive: 'badge-muted',
};

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = mockVehicles.filter(v => {
    const matchSearch = v.licensePlate.toLowerCase().includes(search.toLowerCase())
      || v.brand.toLowerCase().includes(search.toLowerCase())
      || v.ownerName.toLowerCase().includes(search.toLowerCase())
      || v.model.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || v.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quản Lý Phương Tiện</h1>
          <p>Danh sách phương tiện của khách hàng đã đăng ký dịch vụ.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> Thêm Phương Tiện</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ minWidth: 280 }}>
          <Search size={15} />
          <input placeholder="Tìm biển số, hãng xe, chủ xe..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'car', 'motorcycle', 'truck', 'bus'].map(t => (
          <button
            key={t}
            className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'Tất Cả' : typeLabel[t]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Biển Số</th>
              <th>Loại Xe</th>
              <th>Hãng / Model</th>
              <th>Năm SX</th>
              <th>Màu Sắc</th>
              <th>Chủ Xe</th>
              <th>Trạng Thái</th>
              <th style={{ textAlign: 'center' }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14, fontFamily: 'monospace', letterSpacing: 1 }}>
                    {v.licensePlate}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    {typeIcon[v.type]}
                    {typeLabel[v.type]}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.brand} {v.model}</div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{v.year}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)' }} />
                    {v.color}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 11 }}>{v.ownerName.charAt(0)}</div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v.ownerName}</span>
                  </div>
                </td>
                <td><span className={`badge ${statusBadge[v.status]}`}>{statusLabel[v.status]}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
                    <button className="btn btn-secondary btn-sm">Xem</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
