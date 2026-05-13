import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Zap, Star, Plus, Edit2, Trash2, Check, X, Search,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Package
} from 'lucide-react';

// ===================== TYPES =====================
interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // phút
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  totalUsed: number;
}

// ===================== MOCK DATA =====================
const initialServices: ServiceCategory[] = [
  {
    id: 'svc1', name: 'Thay Lốp Xe', description: 'Thay lốp dự phòng hoặc vá lốp tại chỗ',
    price: 150000, duration: 30, isPopular: false, isActive: true,
    features: ['Thay lốp dự phòng', 'Vá lốp tạm thời', 'Kiểm tra áp suất', 'Hỗ trợ 24/7'],
    createdAt: '2024-01-15', totalUsed: 412,
  },
  {
    id: 'svc2', name: 'Kéo Xe Cứu Hộ', description: 'Kéo xe về garage hoặc điểm sửa chữa',
    price: 350000, duration: 60, isPopular: true, isActive: true,
    features: ['Kéo xe tối đa 50km', 'Xe chuyên dụng', 'GPS định vị', 'Bảo hiểm hàng hoá', 'Hỗ trợ 24/7'],
    createdAt: '2024-01-15', totalUsed: 289,
  },
  {
    id: 'svc3', name: 'Cấp Nhiên Liệu', description: 'Cung cấp xăng/dầu khẩn cấp tại chỗ',
    price: 100000, duration: 20, isPopular: false, isActive: true,
    features: ['Xăng RON 92/95', 'Dầu Diesel', 'Tối đa 5 lít miễn phí giao', 'Thanh toán linh hoạt'],
    createdAt: '2024-02-01', totalUsed: 531,
  },
  {
    id: 'svc4', name: 'Khởi Động Ắc Quy', description: 'Sạc bình và khởi động xe chết máy',
    price: 120000, duration: 25, isPopular: false, isActive: true,
    features: ['Kiểm tra bình ắc quy', 'Sạc kích bình', 'Tư vấn thay bình', 'Bảo hành 30 ngày'],
    createdAt: '2024-02-10', totalUsed: 378,
  },
  {
    id: 'svc5', name: 'Mở Khóa Xe', description: 'Hỗ trợ mở khóa xe khi quên chìa hoặc khóa trong xe',
    price: 200000, duration: 30, isPopular: false, isActive: true,
    features: ['Không làm hỏng khóa', 'Thợ chuyên nghiệp', 'Bảo mật thông tin', 'Xác minh chủ xe'],
    createdAt: '2024-03-05', totalUsed: 167,
  },
  {
    id: 'svc6', name: 'Sửa Chữa Tại Chỗ', description: 'Sửa các hư hỏng nhỏ ngay tại hiện trường',
    price: 500000, duration: 90, isPopular: false, isActive: false,
    features: ['Đánh giá hư hỏng', 'Sửa điện nhẹ', 'Sửa máy nhỏ', 'Báo giá minh bạch'],
    createdAt: '2024-04-01', totalUsed: 94,
  },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

// ===================== SERVICE FORM MODAL =====================
interface ServiceFormProps {
  service?: ServiceCategory | null;
  onClose: () => void;
  onSave: (s: ServiceCategory) => void;
}

function ServiceFormModal({ service, onClose, onSave }: ServiceFormProps) {
  const isEdit = !!service;
  const [form, setForm] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price?.toString() || '',
    duration: service?.duration?.toString() || '',
    isPopular: service?.isPopular || false,
    isActive: service?.isActive ?? true,
    features: service?.features?.join('\n') || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Tên dịch vụ không được để trống';
    if (!form.description.trim()) e.description = 'Mô tả không được để trống';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Giá không hợp lệ';
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0) e.duration = 'Thời gian không hợp lệ';
    if (!form.features.trim()) e.features = 'Phải có ít nhất một tính năng';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const saved: ServiceCategory = {
      id: service?.id || `svc${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      isPopular: form.isPopular,
      isActive: form.isActive,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      createdAt: service?.createdAt || new Date().toISOString().split('T')[0],
      totalUsed: service?.totalUsed || 0,
    };
    onSave(saved);
    onClose();
  }

  const inputCls = (field: string) =>
    `w-full bg-[var(--bg-body)] border ${errors[field] ? 'border-red-400' : 'border-[var(--border)]'} rounded-2xl px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-[var(--radius-lg)] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white' }}>
              <Package size={18} />
            </div>
            <div>
              <h2 className="modal-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Danh mục dịch vụ cứu hộ</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block mb-2">Tên dịch vụ *</label>
              <input className={inputCls('name')} placeholder="VD: Thay lốp xe" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
            </div>
            <div>
              <label className="form-label block mb-2">Mô tả *</label>
              <input className={inputCls('description')} placeholder="Mô tả ngắn gọn" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block mb-2">Giá (VNĐ) *</label>
              <input className={inputCls('price')} type="number" placeholder="150000" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              {errors.price && <span className="text-xs text-red-500 mt-1 block">{errors.price}</span>}
            </div>
            <div>
              <label className="form-label block mb-2">Thời gian xử lý (phút) *</label>
              <input className={inputCls('duration')} type="number" placeholder="30" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              {errors.duration && <span className="text-xs text-red-500 mt-1 block">{errors.duration}</span>}
            </div>
          </div>

          <div>
            <label className="form-label block mb-2">Tính năng (mỗi dòng một tính năng) *</label>
            <textarea className={`${inputCls('features')} resize-none`} rows={4}
              placeholder={"Hỗ trợ 24/7\nKiểm tra miễn phí\n..."}
              value={form.features}
              onChange={e => setForm(p => ({ ...p, features: e.target.value }))} />
            {errors.features && <span className="text-xs text-red-500 mt-1 block">{errors.features}</span>}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setForm(p => ({ ...p, isPopular: !p.isPopular }))}
                style={{ color: form.isPopular ? 'var(--primary)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <Star size={18} fill={form.isPopular ? 'currentColor' : 'none'} />
                Đánh dấu phổ biến
              </button>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                style={{ color: form.isActive ? 'var(--success)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                {form.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                {form.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
              </button>
            </label>
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0', margin: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? <><Edit2 size={15} /> Cập nhật</> : <><Plus size={15} /> Thêm dịch vụ</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceCategory | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return services.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? s.isActive : !s.isActive);
      return matchSearch && matchStatus;
    });
  }, [services, search, filterStatus]);

  function handleSave(svc: ServiceCategory) {
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === svc.id);
      if (idx >= 0) {
        const next = [...prev]; next[idx] = svc; return next;
      }
      return [svc, ...prev];
    });
    toast.success(editTarget ? 'Đã cập nhật dịch vụ!' : 'Đã thêm dịch vụ mới!');
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Đã xóa dịch vụ!');
    }
  }

  function handleToggleActive(id: string) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    toast.success('Đã cập nhật trạng thái!');
  }

  function handleTogglePopular(id: string) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isPopular: !s.isPopular } : s));
    toast.success('Đã cập nhật!');
  }

  const activeCount = services.filter(s => s.isActive).length;
  const popularCount = services.filter(s => s.isPopular).length;
  const totalUsed = services.reduce((a, s) => a + s.totalUsed, 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Danh mục dịch vụ</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý dịch vụ cứu hộ</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Thêm, chỉnh sửa, kích hoạt hoặc tạm dừng các dịch vụ cứu hộ trong hệ thống.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowModal(true); }}>
          <Plus size={18} /> Thêm dịch vụ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Tổng dịch vụ', value: services.length, color: 'var(--primary)', icon: Package },
          { label: 'Đang hoạt động', value: activeCount, color: 'var(--success)', icon: Check },
          { label: 'Lượt sử dụng', value: totalUsed.toLocaleString('vi-VN'), color: '#A855F7', icon: Zap },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div>
              <div className="text-3xl font-black text-[var(--text-main)]">{s.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-body)]/50">
          <div className="relative w-full sm:w-80 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${filterStatus === f ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/40'}`}
                onClick={() => setFilterStatus(f)}>
                {f === 'all' ? 'Tất cả' : f === 'active' ? 'Hoạt động' : 'Tạm dừng'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>DỊCH VỤ</th>
                <th>GIÁ</th>
                <th>THỜI GIAN</th>
                <th>LƯỢT DÙNG</th>
                <th>PHỔ BIẾN</th>
                <th>TRẠNG THÁI</th>
                <th className="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-[var(--text-muted)]">
                  <Package size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Không tìm thấy dịch vụ phù hợp</p>
                </td></tr>
              ) : filtered.map(svc => (
                <>
                  <tr key={svc.id} className="hover:bg-[var(--bg-body)]/40 transition-colors group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: svc.isPopular ? 'linear-gradient(135deg,var(--primary),var(--primary-light))' : 'var(--bg-body)', color: svc.isPopular ? 'white' : 'var(--text-muted)' }}>
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="font-black text-[var(--text-main)] text-sm">{svc.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{svc.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-black text-[var(--primary)]">{formatCurrency(svc.price)}</td>
                    <td className="text-sm font-medium text-[var(--text-sub)]">{svc.duration} phút</td>
                    <td>
                      <span className="font-black text-[var(--text-main)]">{svc.totalUsed.toLocaleString('vi-VN')}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-1">lượt</span>
                    </td>
                    <td>
                      <button onClick={() => handleTogglePopular(svc.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: svc.isPopular ? '#f59e0b' : 'var(--text-muted)' }}>
                        <Star size={18} fill={svc.isPopular ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleToggleActive(svc.id)}
                        className="flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full transition-all"
                        style={{ background: svc.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', color: svc.isActive ? 'var(--success)' : 'var(--danger)', border: 'none', cursor: 'pointer' }}>
                        <span className={`w-2 h-2 rounded-full ${svc.isActive ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--danger)]'}`} />
                        {svc.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setExpandedId(expandedId === svc.id ? null : svc.id)}
                          className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all text-xs"
                          title="Xem tính năng">
                          {expandedId === svc.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <button
                          onClick={() => { setEditTarget(svc); setShowModal(true); }}
                          className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-all"
                          title="Chỉnh sửa">
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(svc.id)}
                          className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-red-500 hover:border-red-200 transition-all"
                          title="Xóa">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === svc.id && (
                    <tr key={`${svc.id}-exp`}>
                      <td colSpan={7} style={{ background: 'var(--primary-soft)/20', padding: '12px 24px 16px' }}>
                        <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Tính năng bao gồm:</div>
                        <div className="flex flex-wrap gap-2">
                          {svc.features.map((f, i) => (
                            <span key={i} className="flex items-center gap-1.5 bg-white border border-[var(--border)] rounded-full px-3 py-1 text-xs font-bold text-[var(--text-sub)]">
                              <Check size={11} className="text-[var(--success)]" />{f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ServiceFormModal
          service={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
