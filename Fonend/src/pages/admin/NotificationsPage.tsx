import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Bell, CheckCheck, AlertTriangle, Info, CheckCircle, Send,
  Trash2, Search, Filter, Plus, X, Users, UserCheck, Globe,
  RefreshCw
} from 'lucide-react';

// ===================== TYPES =====================
type NotificationType = 'danger' | 'success' | 'warning' | 'info';
type NotificationTarget = 'all' | 'customers' | 'staff' | 'specific';

interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  target: NotificationTarget;
  isRead: boolean;
  isBroadcast: boolean;
  sentBy: string;
  createdAt: string;
}

// ===================== MOCK DATA =====================
const initialNotifications: SystemNotification[] = [
  {
    id: 'n1', type: 'danger', title: 'Yêu cầu khẩn cấp',
    message: 'Có yêu cầu cứu hộ mức ưu tiên CRITICAL từ khách hàng Lê Văn Cường tại Quận 1.',
    target: 'staff', isRead: false, isBroadcast: false, sentBy: 'Hệ thống', createdAt: '2025-05-09T09:05:00Z',
  },
  {
    id: 'n2', type: 'success', title: 'Hoàn thành yêu cầu',
    message: 'Yêu cầu #R004 đã được hoàn thành bởi Nguyễn Hùng Dũng. Khách hàng đánh giá 5 sao.',
    target: 'all', isRead: false, isBroadcast: false, sentBy: 'Hệ thống', createdAt: '2025-05-08T17:30:00Z',
  },
  {
    id: 'n3', type: 'info', title: 'Bảo trì hệ thống định kỳ',
    message: 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày 15/05. Vui lòng lên kế hoạch trước.',
    target: 'all', isRead: true, isBroadcast: true, sentBy: 'Admin Nguyễn Văn An', createdAt: '2025-05-09T07:00:00Z',
  },
  {
    id: 'n4', type: 'warning', title: 'Khu vực thiếu nhân viên',
    message: 'Quận 7 đang có 3 yêu cầu chờ nhưng không có nhân viên sẵn sàng. Cần phân công gấp.',
    target: 'staff', isRead: true, isBroadcast: false, sentBy: 'Hệ thống', createdAt: '2025-05-09T06:00:00Z',
  },
  {
    id: 'n5', type: 'info', title: 'Chào mừng nhân viên mới',
    message: 'Võ Thành Nam đã tham gia hệ thống. Hãy hỗ trợ nhân viên mới làm quen với quy trình.',
    target: 'staff', isRead: true, isBroadcast: true, sentBy: 'Admin Nguyễn Văn An', createdAt: '2025-05-07T08:00:00Z',
  },
  {
    id: 'n6', type: 'warning', title: 'Khiếu nại chưa được xử lý',
    message: '2 khiếu nại đã quá 24 giờ chưa có phản hồi. Cần xử lý ngay để tránh ảnh hưởng uy tín.',
    target: 'all', isRead: false, isBroadcast: false, sentBy: 'Hệ thống', createdAt: '2025-05-09T11:00:00Z',
  },
];

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  danger: { icon: <AlertTriangle size={16} />, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Khẩn cấp' },
  success: { icon: <CheckCircle size={16} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Thành công' },
  warning: { icon: <AlertTriangle size={16} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Cảnh báo' },
  info: { icon: <Info size={16} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', label: 'Thông tin' },
};

const targetConfig: Record<NotificationTarget, { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'Tất cả', icon: <Globe size={13} />, color: '#6366f1' },
  customers: { label: 'Khách hàng', icon: <Users size={13} />, color: '#3b82f6' },
  staff: { label: 'Nhân viên', icon: <UserCheck size={13} />, color: '#10b981' },
  specific: { label: 'Cụ thể', icon: <Bell size={13} />, color: '#f59e0b' },
};

function timeAgo(str: string) {
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

// ===================== COMPOSE MODAL =====================
interface ComposeModalProps {
  onClose: () => void;
  onSend: (n: SystemNotification) => void;
}

function ComposeModal({ onClose, onSend }: ComposeModalProps) {
  const [form, setForm] = useState({
    type: 'info' as NotificationType,
    title: '',
    message: '',
    target: 'all' as NotificationTarget,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Tiêu đề không được để trống';
    if (!form.message.trim()) e.message = 'Nội dung không được để trống';
    return e;
  }

  function handleSend(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const notif: SystemNotification = {
      id: `n${Date.now()}`,
      type: form.type,
      title: form.title.trim(),
      message: form.message.trim(),
      target: form.target,
      isRead: false,
      isBroadcast: true,
      sentBy: 'Admin',
      createdAt: new Date().toISOString(),
    };
    onSend(notif);
    onClose();
  }

  const inputCls = (field: string) =>
    `w-full bg-[var(--bg-body)] border ${errors[field] ? 'border-red-400' : 'border-[var(--border)]'} rounded-2xl px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-[var(--radius-lg)] w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
              <Bell size={18} />
            </div>
            <div>
              <h2 className="modal-title">Gửi thông báo hệ thống</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">UC-05 · Thông báo hệ thống</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSend} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block mb-2">Loại thông báo</label>
              <select className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as NotificationType }))}>
                <option value="info">📘 Thông tin</option>
                <option value="success">✅ Thành công</option>
                <option value="warning">⚠️ Cảnh báo</option>
                <option value="danger">🚨 Khẩn cấp</option>
              </select>
            </div>
            <div>
              <label className="form-label block mb-2">Đối tượng nhận</label>
              <select className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value as NotificationTarget }))}>
                <option value="all">🌐 Tất cả người dùng</option>
                <option value="customers">👥 Chỉ khách hàng</option>
                <option value="staff">👔 Chỉ nhân viên cứu hộ</option>
                <option value="specific">📌 Người dùng cụ thể</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label block mb-2">Tiêu đề *</label>
            <input className={inputCls('title')} placeholder="VD: Thông báo bảo trì hệ thống"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title}</span>}
          </div>

          <div>
            <label className="form-label block mb-2">Nội dung *</label>
            <textarea className={`${inputCls('message')} resize-none`} rows={4}
              placeholder="Nhập nội dung thông báo chi tiết..."
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
            {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message}</span>}
          </div>

          <div className="modal-footer" style={{ padding: '12px 0 0', margin: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary">
              <Send size={15} /> Gửi thông báo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showCompose, setShowCompose] = useState(false);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const q = search.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || n.type === typeFilter;
      const matchRead = readFilter === 'all' || (readFilter === 'unread' ? !n.isRead : n.isRead);
      return matchSearch && matchType && matchRead;
    });
  }, [notifications, search, typeFilter, readFilter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  function handleDelete(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Đã xóa thông báo');
  }

  function handleSend(notif: SystemNotification) {
    setNotifications(prev => [notif, ...prev]);
    toast.success(`Đã gửi thông báo đến ${targetConfig[notif.target].label}!`);
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Thông báo hệ thống</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Thông báo hệ thống</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Quản lý và gửi thông báo đến khách hàng, nhân viên cứu hộ trên toàn hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllRead}>
              <CheckCheck size={15} /> Đọc tất cả ({unreadCount})
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowCompose(true)}>
            <Plus size={16} /> Gửi thông báo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Tổng thông báo', value: notifications.length, color: 'var(--primary)', icon: Bell },
          { label: 'Chưa đọc', value: unreadCount, color: '#ef4444', icon: AlertTriangle },
          { label: 'Broadcast', value: notifications.filter(n => n.isBroadcast).length, color: '#8b5cf6', icon: Globe },
          { label: 'Hôm nay', value: notifications.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length, color: 'var(--success)', icon: RefreshCw },
        ].map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
              <s.icon size={18} />
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--text-main)]">{s.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72 group">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input placeholder="Tìm thông báo..."
            className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-[var(--text-muted)]" />
          {(['all', 'unread', 'read'] as const).map(f => (
            <button key={f}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${readFilter === f ? 'bg-[var(--primary)] text-white' : 'bg-white border border-[var(--border)] text-[var(--text-muted)]'}`}
              onClick={() => setReadFilter(f)}>
              {f === 'all' ? 'Tất cả' : f === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
            </button>
          ))}
          <select className="bg-white border border-[var(--border)] rounded-2xl px-4 py-2.5 text-xs font-black outline-none focus:border-[var(--primary)]"
            value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
            <option value="all">Tất cả loại</option>
            <option value="info">📘 Thông tin</option>
            <option value="success">✅ Thành công</option>
            <option value="warning">⚠️ Cảnh báo</option>
            <option value="danger">🚨 Khẩn cấp</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Bell size={40} className="mx-auto mb-3 opacity-20 text-[var(--text-muted)]" />
            <p className="font-bold text-[var(--text-muted)]">Không có thông báo nào</p>
          </div>
        ) : filtered.map(n => {
          const tc = typeConfig[n.type];
          const tg = targetConfig[n.target];
          return (
            <div key={n.id}
              className="card"
              style={{
                padding: '16px 20px',
                background: n.isRead ? 'white' : tc.bg,
                border: n.isRead ? '1px solid var(--border)' : `1px solid ${tc.color}22`,
                opacity: n.isRead ? 0.8 : 1,
                transition: 'all 0.2s ease',
              }}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: n.isRead ? 'var(--bg-body)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tc.color,
                }}>
                  {tc.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main)' }}>{n.title}</span>
                    {!n.isRead && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: tc.color, flexShrink: 0 }} />
                    )}
                    {n.isBroadcast && (
                      <span style={{ fontSize: 10, fontWeight: 900, background: `${tg.color}18`, color: tg.color, padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {tg.icon} {tg.label}
                      </span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 900, background: tc.bg, color: tc.color, padding: '2px 8px', borderRadius: 99 }}>
                      {tc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: 6 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                    <span>{timeAgo(n.createdAt)}</span>
                    <span>· Gửi bởi: {n.sentBy}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!n.isRead && (
                    <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                      title="Đánh dấu đã đọc"
                      style={{ padding: '6px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--success)' }}>
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); handleDelete(n.id); }}
                    title="Xóa"
                    style={{ padding: '6px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', color: 'var(--danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onSend={handleSend} />}
    </div>
  );
}
