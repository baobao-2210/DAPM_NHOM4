import { useState, useMemo } from 'react';
import {
  Search, Plus, Eye, CheckCircle, XCircle, MapPin, Phone,
  Clock, AlertTriangle, Truck, Filter, FileText, Activity, X
} from 'lucide-react';
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

const statusClass: Record<RequestStatus, { bg: string, text: string, dot: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  accepted: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const priorityClass: Record<string, { bg: string, text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
  high: { bg: 'bg-amber-100', text: 'text-amber-700' },
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
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

  const filtered = useMemo(() => {
    return mockRequests.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.vehiclePlate.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchPriority = filterPriority === 'all' || r.priority === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [search, filterStatus, filterPriority]);

  const countByStatus = (s: string) => mockRequests.filter(r => r.status === s).length;
  
  const pendingCount = countByStatus('pending');
  const activeCount = countByStatus('accepted') + countByStatus('dispatched') + countByStatus('in_progress');
  const completedCount = countByStatus('completed');

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Yêu Cầu Cứu Hộ</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý Yêu cầu</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Theo dõi và xử lý tất cả yêu cầu hỗ trợ xe từ khách hàng.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Tạo Yêu Cầu Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Tổng Yêu Cầu', value: mockRequests.length, color: 'var(--primary)', icon: FileText },
          { label: 'Chờ Xử Lý', value: pendingCount, color: '#f59e0b', icon: Clock },
          { label: 'Đang Xử Lý', value: activeCount, color: '#3b82f6', icon: Activity },
          { label: 'Hoàn Thành', value: completedCount, color: 'var(--success)', icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div>
              <div className="text-3xl font-black text-[var(--text-main)]">{s.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6" style={{ gridTemplateColumns: selected ? '1fr 380px' : '1fr' }}>
        
        {/* Left Side: Table & Filters */}
        <div className="space-y-6 min-w-0">
          
          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'Tất Cả', count: mockRequests.length },
              { key: 'pending', label: 'Chờ Xử Lý', count: pendingCount },
              { key: 'in_progress', label: 'Đang Xử Lý', count: countByStatus('in_progress') },
              { key: 'dispatched', label: 'Đang Đến', count: countByStatus('dispatched') },
              { key: 'completed', label: 'Hoàn Thành', count: completedCount },
              { key: 'cancelled', label: 'Đã Hủy', count: countByStatus('cancelled') },
            ].map(tab => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  filterStatus === tab.key 
                    ? 'bg-[var(--primary)] text-white shadow-md' 
                    : 'bg-white border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/40'
                }`}
                onClick={() => setFilterStatus(tab.key)}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  filterStatus === tab.key ? 'bg-white/20 text-white' : 'bg-[var(--bg-body)] text-[var(--text-muted)]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-body)]/50">
              <div className="relative w-full sm:flex-1 group max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                <input
                  placeholder="Tìm khách hàng, biển số, địa điểm..."
                  className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <select
                  className="bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5 text-[var(--text-main)] font-medium"
                  value={filterPriority}
                  onChange={e => setFilterPriority(e.target.value)}
                >
                  <option value="all">Tất Cả Ưu Tiên</option>
                  <option value="critical">Khẩn Cấp</option>
                  <option value="high">Cao</option>
                  <option value="medium">Trung Bình</option>
                  <option value="low">Thấp</option>
                </select>
                <button className="btn btn-secondary px-4">
                  <Filter size={16} /> <span className="hidden sm:inline">Lọc</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>KHÁCH HÀNG</th>
                    <th>SỰ CỐ</th>
                    <th>TRẠNG THÁI</th>
                    <th>ƯU TIÊN</th>
                    <th>NHÂN VIÊN</th>
                    <th className="text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-16 text-[var(--text-muted)]">
                      <FileText size={40} className="mx-auto mb-3 opacity-20" />
                      <p className="font-bold">Không tìm thấy yêu cầu phù hợp</p>
                    </td></tr>
                  ) : filtered.map(req => {
                    const statusConfig = statusClass[req.status];
                    const priorityCfg = priorityClass[req.priority];
                    const isSelected = selected?.id === req.id;

                    return (
                      <tr 
                        key={req.id} 
                        className={`cursor-pointer transition-colors group ${isSelected ? 'bg-[var(--primary)]/5' : 'hover:bg-[var(--bg-body)]/40'}`}
                        onClick={() => setSelected(s => s?.id === req.id ? null : req)}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
                                 style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-light))' }}>
                              {req.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-[var(--text-main)] text-sm">{req.customerName}</div>
                              <div className="text-xs text-[var(--text-muted)]">{req.vehiclePlate}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-black text-[var(--text-main)] text-sm">{problemLabels[req.problemType]}</div>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-0.5">
                            <MapPin size={10} className="text-[var(--primary)] flex-shrink-0" />
                            <span className="truncate max-w-[120px]" title={req.location.address}>{req.location.address}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusLabels[req.status]}
                          </span>
                        </td>
                        <td>
                          <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${priorityCfg.bg} ${priorityCfg.text}`}>
                            {priorityLabel[req.priority]}
                          </span>
                        </td>
                        <td>
                          {req.assignedStaffName ? (
                            <span className="font-bold text-[var(--text-main)] text-sm">{req.assignedStaffName}</span>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] italic">Chưa phân công</span>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === 'pending' && (
                              <button 
                                className="btn btn-primary py-1.5 px-3 text-xs"
                                onClick={e => { e.stopPropagation(); /* TODO: Accept */ }}
                              >
                                <CheckCircle size={14} /> Tiếp Nhận
                              </button>
                            )}
                            <button 
                              className={`p-2 rounded-xl border transition-all ${isSelected ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40'}`}
                              onClick={e => { e.stopPropagation(); setSelected(req); }}
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="card h-fit sticky top-[88px] animate-slide-up border-2 border-[var(--primary)]/20 shadow-xl overflow-hidden">
            <div className="bg-[var(--bg-body)]/50 border-b border-[var(--border)] p-5 flex items-center justify-between">
              <div>
                <h3 className="font-black text-[var(--text-main)] text-lg">Chi Tiết Yêu Cầu</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 uppercase tracking-wider font-bold">#{selected.id.toUpperCase()}</p>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:border-red-200 transition-all"
                onClick={() => setSelected(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Customer */}
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Khách Hàng</div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white"
                       style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-light))' }}>
                    {selected.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-[var(--text-main)] text-base">{selected.customerName}</div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-sub)] mt-1 font-medium">
                      <Phone size={14} className="text-[var(--primary)]" /> {selected.customerPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Phương Tiện</div>
                <div className="flex items-center gap-3 bg-[var(--bg-body)] p-3 rounded-2xl border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--text-main)] shadow-sm">
                    <Truck size={18} />
                  </div>
                  <div>
                    <div className="font-black text-[var(--text-main)] text-sm">{selected.vehicleModel}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">Biển số: <span className="font-bold text-[var(--text-sub)]">{selected.vehiclePlate}</span></div>
                  </div>
                </div>
              </div>

              {/* Problem */}
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Thông Tin Sự Cố</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-black text-[var(--text-main)] text-base">{problemLabels[selected.problemType]}</div>
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${priorityClass[selected.priority].bg} ${priorityClass[selected.priority].text}`}>
                      {priorityLabel[selected.priority]}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-sub)] leading-relaxed bg-[var(--bg-body)]/50 p-3 rounded-xl border border-[var(--border)]">
                    {selected.description}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Địa Điểm</div>
                <div className="flex items-start gap-2 text-sm text-[var(--text-sub)] font-medium">
                  <MapPin size={16} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <span>{selected.location.address}</span>
                </div>
              </div>

              {/* Status & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Trạng Thái</div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClass[selected.status].bg} ${statusClass[selected.status].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusClass[selected.status].dot}`} />
                    {statusLabels[selected.status]}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Thời Gian Tạo</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-sub)] h-[24px]">
                    <Clock size={12} className="text-[var(--text-muted)]" /> {formatTime(selected.createdAt)}
                  </div>
                </div>
              </div>

              {/* Cost */}
              {selected.cost && (
                <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-4 flex justify-between items-center">
                  <div className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">Chi Phí Dự Kiến</div>
                  <div className="text-xl font-black text-[var(--primary)]">{formatCurrency(selected.cost)}</div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {selected.status === 'pending' && (
                  <button className="btn btn-primary w-full py-3 shadow-md">
                    <CheckCircle size={18} /> Tiếp Nhận & Phân Công
                  </button>
                )}
                {(selected.status === 'accepted' || selected.status === 'dispatched') && (
                  <button className="btn btn-primary w-full py-3 shadow-md" style={{ background: '#3b82f6' }}>
                    <AlertTriangle size={18} /> Cập Nhật Tiến Độ
                  </button>
                )}
                <div className="flex gap-3">
                  <button className="btn bg-white border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-body)] flex-1 py-3 font-bold">
                    <MapPin size={16} /> Xem Bản Đồ
                  </button>
                  {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                    <button className="btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex-1 py-3 font-bold">
                      <XCircle size={16} /> Hủy Bỏ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
