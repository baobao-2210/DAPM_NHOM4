import { useState, useMemo } from 'react';
import {
  Search, Plus, Car, Bike, Truck, Bus, Edit2, Trash2, X,
  ShieldCheck, AlertCircle, WrenchIcon, Hash
} from 'lucide-react';
import { mockVehicles } from '../../data/mockData';
import type { Vehicle } from '../../types';

// ===================== HELPERS =====================
const TYPE_ICON: Record<string, React.ReactNode> = {
  car:        <Car size={18} />,
  motorcycle: <Bike size={18} />,
  truck:      <Truck size={18} />,
  bus:        <Bus size={18} />,
};
const TYPE_LABEL: Record<string, string> = {
  car: 'Ô Tô', motorcycle: 'Xe Máy', truck: 'Xe Tải', bus: 'Xe Buýt',
};
const STATUS_LABEL: Record<string, string> = {
  active:     'Hoạt Động',
  in_service: 'Đang Sửa',
  inactive:   'Ngừng HĐ',
};
const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  active:     { bg: 'rgba(16,185,129,0.10)', text: 'var(--success)',  dot: 'var(--success)' },
  in_service: { bg: 'rgba(245,158,11,0.10)', text: '#f59e0b',         dot: '#f59e0b' },
  inactive:   { bg: 'rgba(107,114,128,0.10)', text: 'var(--text-muted)', dot: 'var(--text-muted)' },
};

// ===================== FORM MODAL =====================
interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}

function VehicleFormModal({ vehicle, onClose, onSave }: VehicleFormProps) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState({
    licensePlate: vehicle?.licensePlate || '',
    brand:        vehicle?.brand        || '',
    model:        vehicle?.model        || '',
    year:         vehicle?.year?.toString() || new Date().getFullYear().toString(),
    color:        vehicle?.color        || '',
    type:         vehicle?.type         || 'car',
    ownerName:    vehicle?.ownerName    || '',
    status:       vehicle?.status       || 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.licensePlate.trim()) e.licensePlate = 'Biển số không được để trống';
    if (!form.brand.trim())        e.brand        = 'Hãng xe không được để trống';
    if (!form.model.trim())        e.model        = 'Model không được để trống';
    if (!form.ownerName.trim())    e.ownerName    = 'Chủ xe không được để trống';
    const yr = Number(form.year);
    if (!form.year || isNaN(yr) || yr < 1990 || yr > new Date().getFullYear() + 1)
      e.year = 'Năm sản xuất không hợp lệ';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const saved: Vehicle = {
      id:           vehicle?.id || `v${Date.now()}`,
      ownerId:      vehicle?.ownerId || '',
      ownerName:    form.ownerName.trim(),
      licensePlate: form.licensePlate.trim().toUpperCase(),
      brand:        form.brand.trim(),
      model:        form.model.trim(),
      year:         Number(form.year),
      color:        form.color.trim(),
      type:         form.type as Vehicle['type'],
      status:       form.status as Vehicle['status'],
    };
    onSave(saved);
    onClose();
  }

  const field = (name: string) =>
    `w-full bg-[var(--bg-body)] border ${errors[name] ? 'border-red-400' : 'border-[var(--border)]'} ` +
    `rounded-2xl px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-[var(--radius-lg)] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white' }}
            >
              <Car size={18} />
            </div>
            <div>
              <h2 className="modal-title">{isEdit ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Thông tin đăng ký phương tiện</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block mb-2">Biển số xe *</label>
              <input className={field('licensePlate')} placeholder="VD: 51A-12345"
                value={form.licensePlate}
                onChange={e => setForm(p => ({ ...p, licensePlate: e.target.value }))} />
              {errors.licensePlate && <span className="text-xs text-red-500 mt-1 block">{errors.licensePlate}</span>}
            </div>
            <div>
              <label className="form-label block mb-2">Chủ xe *</label>
              <input className={field('ownerName')} placeholder="Họ và tên chủ xe"
                value={form.ownerName}
                onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} />
              {errors.ownerName && <span className="text-xs text-red-500 mt-1 block">{errors.ownerName}</span>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block mb-2">Hãng xe *</label>
              <input className={field('brand')} placeholder="VD: Toyota, Honda..."
                value={form.brand}
                onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
              {errors.brand && <span className="text-xs text-red-500 mt-1 block">{errors.brand}</span>}
            </div>
            <div>
              <label className="form-label block mb-2">Model *</label>
              <input className={field('model')} placeholder="VD: Vios, City..."
                value={form.model}
                onChange={e => setForm(p => ({ ...p, model: e.target.value }))} />
              {errors.model && <span className="text-xs text-red-500 mt-1 block">{errors.model}</span>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label block mb-2">Năm SX *</label>
              <input className={field('year')} type="number" placeholder="2022"
                value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              {errors.year && <span className="text-xs text-red-500 mt-1 block">{errors.year}</span>}
            </div>
            <div>
              <label className="form-label block mb-2">Màu sắc</label>
              <input className={field('color')} placeholder="VD: Trắng, Đen..."
                value={form.color}
                onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            </div>
            <div>
              <label className="form-label block mb-2">Loại xe</label>
              <select
                className={field('type')}
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              >
                {Object.entries(TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="form-label block mb-2">Trạng thái</label>
            <div className="flex gap-3">
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: k }))}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border"
                  style={{
                    background: form.status === k ? STATUS_COLOR[k].bg : 'white',
                    color: form.status === k ? STATUS_COLOR[k].text : 'var(--text-muted)',
                    borderColor: form.status === k ? STATUS_COLOR[k].dot : 'var(--border)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: form.status === k ? STATUS_COLOR[k].dot : 'var(--border)' }}
                  />
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ padding: '16px 0 0', margin: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? <><Edit2 size={15} /> Cập nhật</> : <><Plus size={15} /> Thêm phương tiện</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q);
      const matchType   = filterType   === 'all' || v.type   === filterType;
      const matchStatus = filterStatus === 'all' || v.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [vehicles, search, filterType, filterStatus]);

  function handleSave(v: Vehicle) {
    setVehicles(prev => {
      const idx = prev.findIndex(x => x.id === v.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = v; return next; }
      return [v, ...prev];
    });
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    if (window.confirm('Bạn có chắc muốn xoá phương tiện này?')) {
      setVehicles(prev => prev.filter(x => x.id !== id));
    }
  }

  // Stats
  const activeCount    = vehicles.filter(v => v.status === 'active').length;
  const inServiceCount = vehicles.filter(v => v.status === 'in_service').length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span>
            <span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Phương tiện</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý phương tiện</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">
            Danh sách phương tiện của khách hàng đã đăng ký trong hệ thống cứu hộ.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditTarget(null); setShowModal(true); }}
        >
          <Plus size={18} /> Thêm phương tiện
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Tổng phương tiện', value: vehicles.length,  color: 'var(--primary)', icon: Car },
          { label: 'Đang hoạt động',   value: activeCount,       color: 'var(--success)', icon: ShieldCheck },
          { label: 'Đang sửa chữa',    value: inServiceCount,    color: '#f59e0b',        icon: WrenchIcon },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${s.color}18`, color: s.color }}
            >
              <s.icon size={22} />
            </div>
            <div>
              <div className="text-3xl font-black text-[var(--text-main)]">{s.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter + Table ── */}
      <div className="card p-0 overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[var(--bg-body)]/50 flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-80 group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors"
            />
            <input
              placeholder="Tìm biển số, hãng xe, chủ xe..."
              className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Type filter */}
            {(['all', 'car', 'motorcycle', 'truck', 'bus'] as const).map(t => (
              <button
                key={t}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${filterType === t ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/40'}`}
                onClick={() => setFilterType(t)}
              >
                {t === 'all' ? 'Tất cả' : TYPE_LABEL[t]}
              </button>
            ))}

            <div className="w-px bg-[var(--border)] self-stretch mx-1" />

            {/* Status filter */}
            {(['all', 'active', 'in_service', 'inactive'] as const).map(s => (
              <button
                key={s}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/40'}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'Mọi trạng thái' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>BIỂN SỐ</th>
                <th>LOẠI XE</th>
                <th>HÃNG / MODEL</th>
                <th>NĂM SX</th>
                <th>MÀU SẮC</th>
                <th>CHỦ XE</th>
                <th>TRẠNG THÁI</th>
                <th className="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-[var(--text-muted)]">
                    <Car size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold">Không tìm thấy phương tiện phù hợp</p>
                  </td>
                </tr>
              ) : filtered.map(v => {
                const sc = STATUS_COLOR[v.status];
                return (
                  <tr key={v.id} className="hover:bg-[var(--bg-body)]/40 transition-colors group">
                    {/* Biển số */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--primary-soft,rgba(0,63,177,0.08))', color: 'var(--primary)' }}
                        >
                          <Hash size={14} />
                        </div>
                        <span className="font-black text-[var(--primary)] text-sm tracking-widest font-mono">
                          {v.licensePlate}
                        </span>
                      </div>
                    </td>

                    {/* Loại xe */}
                    <td>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-sub)] font-medium">
                        <span className="text-[var(--text-muted)]">{TYPE_ICON[v.type]}</span>
                        {TYPE_LABEL[v.type]}
                      </div>
                    </td>

                    {/* Hãng / Model */}
                    <td>
                      <div className="font-black text-[var(--text-main)] text-sm">{v.brand}</div>
                      <div className="text-xs text-[var(--text-muted)]">{v.model}</div>
                    </td>

                    {/* Năm */}
                    <td className="text-sm font-medium text-[var(--text-sub)]">{v.year}</td>

                    {/* Màu */}
                    <td>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-sub)]">
                        <div
                          className="w-4 h-4 rounded-md border border-[var(--border)]"
                          style={{ background: 'var(--bg-elevated)' }}
                        />
                        {v.color || '—'}
                      </div>
                    </td>

                    {/* Chủ xe */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}>
                          {v.ownerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-main)]">{v.ownerName}</span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${v.status === 'active' ? 'animate-pulse' : ''}`}
                          style={{ background: sc.dot }}
                        />
                        {STATUS_LABEL[v.status]}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditTarget(v); setShowModal(true); }}
                          className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-red-500 hover:border-red-200 transition-all"
                          title="Xoá"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-body)]/30 flex items-center gap-2">
            <AlertCircle size={13} className="text-[var(--text-muted)]" />
            <span className="text-xs text-[var(--text-muted)] font-bold">
              Hiển thị <span className="text-[var(--primary)]">{filtered.length}</span> / {vehicles.length} phương tiện
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <VehicleFormModal
          vehicle={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
