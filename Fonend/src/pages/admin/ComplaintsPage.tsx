import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  MessageSquare, Search, Eye, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, AlertTriangle, Send, X, User,
  Star, Filter
} from 'lucide-react';

// ===================== TYPES =====================
type ComplaintStatus = 'pending' | 'processing' | 'resolved' | 'rejected';
type ComplaintType = 'service_quality' | 'staff_behavior' | 'pricing' | 'delay' | 'other';

interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  requestId: string;
  staffName: string;
  type: ComplaintType;
  title: string;
  content: string;
  status: ComplaintStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  adminResponse?: string;
  rating?: number;
}

// ===================== MOCK DATA =====================
const initialComplaints: Complaint[] = [
  {
    id: 'cpl001', customerId: 'u3', customerName: 'Lê Văn Cường', customerPhone: '0923456789',
    requestId: 'r1', staffName: 'Trần Minh Khoa', type: 'delay',
    title: 'Nhân viên đến trễ hơn 45 phút', priority: 'high',
    content: 'Tôi đặt cứu hộ lúc 8h30, nhân viên nói sẽ đến trong 20 phút nhưng mãi đến 9h45 mới đến. Tôi phải đứng giữa đường trong trời nắng rất lâu. Điều này không thể chấp nhận được.',
    status: 'pending', createdAt: '2025-05-09T10:00:00Z', rating: 2,
  },
  {
    id: 'cpl002', customerId: 'u4', customerName: 'Phạm Thị Lan', customerPhone: '0934567890',
    requestId: 'r2', staffName: 'Lê Quang Vinh', type: 'pricing',
    title: 'Phí dịch vụ cao hơn báo giá ban đầu', priority: 'medium',
    content: 'Nhân viên báo giá 200.000đ khi đặt, nhưng cuối cùng tính 350.000đ mà không giải thích rõ lý do. Đây là cách làm việc không trung thực.',
    status: 'processing', createdAt: '2025-05-08T15:30:00Z', rating: 3,
    adminResponse: 'Chúng tôi đã liên hệ với nhân viên để xác minh sự việc. Đang xử lý...',
  },
  {
    id: 'cpl003', customerId: 'u5', customerName: 'Hoàng Minh Tuấn', customerPhone: '0945678901',
    requestId: 'r3', staffName: 'Nguyễn Hùng Dũng', type: 'service_quality',
    title: 'Lốp thay không đúng loại xe', priority: 'high',
    content: 'Nhân viên thay lốp sai kích thước, chỉ phát hiện ra khi đến garage kiểm tra. Tôi phải bỏ thêm tiền để thay lại đúng loại. Yêu cầu hoàn tiền phần chênh lệch.',
    status: 'resolved', createdAt: '2025-05-07T09:00:00Z', resolvedAt: '2025-05-07T16:00:00Z', rating: 4,
    adminResponse: 'Chúng tôi đã xác nhận sự cố và hoàn trả toàn bộ phí dịch vụ. Nhân viên liên quan đã được nhắc nhở và đào tạo lại. Chúng tôi xin lỗi vì sự bất tiện này.',
  },
  {
    id: 'cpl004', customerId: 'u3', customerName: 'Lê Văn Cường', customerPhone: '0923456789',
    requestId: 'r4', staffName: 'Phạm Đức Tài', type: 'staff_behavior',
    title: 'Nhân viên thái độ không tốt', priority: 'medium',
    content: 'Nhân viên có thái độ thiếu chuyên nghiệp, nói chuyện cộc lốc và không lắng nghe yêu cầu của khách. Cần cải thiện kỹ năng giao tiếp.',
    status: 'rejected', createdAt: '2025-05-06T14:00:00Z', resolvedAt: '2025-05-06T18:00:00Z', rating: 2,
    adminResponse: 'Qua xem xét camera và phỏng vấn nhân viên, chúng tôi chưa xác nhận được hành vi như mô tả. Tuy nhiên chúng tôi sẽ tiếp tục theo dõi.',
  },
  {
    id: 'cpl005', customerId: 'u4', customerName: 'Phạm Thị Lan', customerPhone: '0934567890',
    requestId: 'r5', staffName: 'Võ Thành Nam', type: 'other',
    title: 'Ứng dụng liên tục báo lỗi', priority: 'low',
    content: 'Khi tôi cố gắng theo dõi vị trí nhân viên cứu hộ, ứng dụng liên tục thoát và báo lỗi. Tôi phải gọi điện để hỏi thông tin.',
    status: 'pending', createdAt: '2025-05-09T11:00:00Z',
  },
];

const typeLabel: Record<ComplaintType, string> = {
  service_quality: 'Chất lượng dịch vụ',
  staff_behavior: 'Hành vi nhân viên',
  pricing: 'Về giá cả',
  delay: 'Trễ hẹn',
  other: 'Khác',
};
const typeColor: Record<ComplaintType, string> = {
  service_quality: 'bg-purple-100 text-purple-700',
  staff_behavior: 'bg-red-100 text-red-700',
  pricing: 'bg-yellow-100 text-yellow-700',
  delay: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
};
const statusLabel: Record<ComplaintStatus, string> = {
  pending: 'Chờ xử lý', processing: 'Đang xử lý', resolved: 'Đã giải quyết', rejected: 'Từ chối',
};
const statusColor: Record<ComplaintStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', dot: '#f59e0b' },
  processing: { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', dot: '#3b82f6' },
  resolved: { bg: 'rgba(16,185,129,0.1)', text: '#059669', dot: '#10b981' },
  rejected: { bg: 'rgba(239,68,68,0.08)', text: '#dc2626', dot: '#ef4444' },
};

function timeAgo(str: string) {
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

// ===================== DETAIL MODAL =====================
interface DetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onRespond: (id: string, response: string, status: ComplaintStatus) => void;
}

function ComplaintDetailModal({ complaint, onClose, onRespond }: DetailModalProps) {
  const [response, setResponse] = useState(complaint.adminResponse || '');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  const canEdit = complaint.status === 'pending' || complaint.status === 'processing';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-[var(--radius-lg)] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="modal-title">Chi tiết khiếu nại #{complaint.id}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{timeAgo(complaint.createdAt)}</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Customer & Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-body)] rounded-2xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Khách hàng</div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-black text-sm flex items-center justify-center">
                  {complaint.customerName.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-[var(--text-main)] text-sm">{complaint.customerName}</div>
                  <div className="text-xs text-[var(--text-muted)]">{complaint.customerPhone}</div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--bg-body)] rounded-2xl p-4">
              <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Yêu cầu liên quan</div>
              <div className="font-black text-sm text-[var(--primary)]">#{complaint.requestId.toUpperCase()}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">NV: {complaint.staffName}</div>
            </div>
          </div>

          {/* Complaint Content */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${typeColor[complaint.type]}`}>{typeLabel[complaint.type]}</span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: statusColor[complaint.status].bg, color: statusColor[complaint.status].text }}>
                {statusLabel[complaint.status]}
              </span>
              {complaint.rating && (
                <div className="flex items-center gap-1 text-xs font-black text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < (complaint.rating || 0) ? 'currentColor' : 'none'} />
                  ))}
                </div>
              )}
            </div>
            <div className="font-black text-[var(--text-main)] mb-2">{complaint.title}</div>
            <div className="bg-[var(--bg-body)] rounded-2xl p-4 text-sm text-[var(--text-sub)] leading-relaxed">
              {complaint.content}
            </div>
          </div>

          {/* Admin Response */}
          {canEdit ? (
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">Phản hồi của quản trị viên</label>
              <textarea
                className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 resize-none"
                rows={4}
                placeholder="Nhập nội dung phản hồi cho khách hàng..."
                value={response}
                onChange={e => setResponse(e.target.value)}
              />
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Cập nhật trạng thái:</label>
                <select
                  className="bg-white border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--primary)] flex-1"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                >
                  <option value="processing">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          ) : complaint.adminResponse ? (
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Phản hồi từ quản trị</div>
              <div className="bg-[var(--primary-soft)] rounded-2xl p-4 text-sm text-[var(--text-sub)] leading-relaxed border border-[var(--primary)]/10">
                {complaint.adminResponse}
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          {canEdit && (
            <button className="btn btn-primary" onClick={() => { onRespond(complaint.id, response, newStatus); onClose(); }}>
              <Send size={15} /> Gửi phản hồi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
const PAGE_SIZE = 5;

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ComplaintType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Complaint | null>(null);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q) || c.id.includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchType = typeFilter === 'all' || c.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [complaints, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleRespond(id: string, response: string, status: ComplaintStatus) {
    setComplaints(prev => prev.map(c => c.id === id ? {
      ...c, adminResponse: response, status,
      resolvedAt: (status === 'resolved' || status === 'rejected') ? new Date().toISOString() : c.resolvedAt
    } : c));
    toast.success('Đã gửi phản hồi thành công!');
  }

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const processingCount = complaints.filter(c => c.status === 'processing').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Xử lý khiếu nại</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý khiếu nại</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Tiếp nhận, xử lý và phản hồi các khiếu nại từ khách hàng một cách nhanh chóng và chuyên nghiệp.</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-2xl px-4 py-3">
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            <span className="text-sm font-black text-[var(--warning)]">{pendingCount} khiếu nại chờ xử lý</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Chờ xử lý', value: pendingCount, color: '#f59e0b', icon: Clock },
          { label: 'Đang xử lý', value: processingCount, color: '#3b82f6', icon: MessageSquare },
          { label: 'Đã giải quyết', value: resolvedCount, color: 'var(--success)', icon: CheckCircle },
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

      {/* Table Card */}
      <div className="card p-0 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-[var(--border)] flex flex-col lg:flex-row gap-4 items-center justify-between bg-[var(--bg-body)]/50">
          <div className="relative w-full lg:w-72 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input placeholder="Tìm theo tiêu đề, khách hàng..."
              className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
              value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Filter size={16} className="text-[var(--text-muted)] flex-shrink-0" />
            <select className="bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] flex-1 lg:flex-none min-w-[140px]"
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="rejected">Từ chối</option>
            </select>
            <select className="bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] flex-1 lg:flex-none min-w-[160px]"
              value={typeFilter} onChange={e => { setTypeFilter(e.target.value as any); setCurrentPage(1); }}>
              <option value="all">Tất cả loại</option>
              <option value="service_quality">Chất lượng dịch vụ</option>
              <option value="staff_behavior">Hành vi nhân viên</option>
              <option value="pricing">Về giá cả</option>
              <option value="delay">Trễ hẹn</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>KHÁCH HÀNG</th>
                <th>TIÊU ĐỀ / LOẠI</th>
                <th>ƯU TIÊN</th>
                <th>TRẠNG THÁI</th>
                <th>THỜI GIAN</th>
                <th className="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-[var(--text-muted)]">
                  <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Không có khiếu nại nào</p>
                </td></tr>
              ) : paginated.map(c => {
                const sc = statusColor[c.status];
                return (
                  <tr key={c.id} className="hover:bg-[var(--bg-body)]/40 transition-colors">
                    <td className="font-bold text-[var(--text-muted)]">#{c.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="font-black text-[var(--text-main)] text-sm">{c.customerName}</div>
                          <div className="text-xs text-[var(--text-muted)]">{c.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-sm text-[var(--text-main)] mb-1 max-w-[200px] truncate">{c.title}</div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${typeColor[c.type]}`}>{typeLabel[c.type]}</span>
                    </td>
                    <td>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${c.priority === 'high' ? 'bg-red-100 text-red-700' : c.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.priority === 'high' ? 'Cao' : c.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full w-fit" style={{ background: sc.bg, color: sc.text }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                        {statusLabel[c.status]}
                      </span>
                    </td>
                    <td className="text-xs text-[var(--text-muted)] font-medium">{timeAgo(c.createdAt)}</td>
                    <td className="text-right">
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelected(c)}>
                        <Eye size={14} /> Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-body)]/30">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {filtered.length} khiếu nại · Trang {page}/{totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-sub)] hover:text-[var(--primary)] disabled:opacity-30"
              disabled={page === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-sub)] hover:text-[var(--primary)] disabled:opacity-30"
              disabled={page === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <ComplaintDetailModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onRespond={handleRespond}
        />
      )}
    </div>
  );
}
