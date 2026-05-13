import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Shield, UserCheck, UserX, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, UserPlus, MoreHorizontal,
  Edit2, Trash2, Lock, Unlock, Eye, TrendingUp, X
} from 'lucide-react';

interface AdminUser {
  id: number; name: string; email: string; phone: string;
  role: 'admin' | 'staff' | 'customer' | 'guest';
  status: 'active' | 'locked'; registeredAt: string;
}

const mockAdminUsers: AdminUser[] = [
  { id: 2901, name: 'Nguyễn Văn An',   email: 'an.nguyen@resilient.vn', phone: '0901234567', role: 'admin',    status: 'active', registeredAt: '12/05/2023' },
  { id: 2894, name: 'Lê Thị Mai',       email: 'mai.le@gmail.com',        phone: '0912345678', role: 'customer', status: 'active', registeredAt: '20/11/2023' },
  { id: 2881, name: 'Trần Minh Quân',   email: 'quan.tm@resilient.vn',   phone: '0923456789', role: 'staff',    status: 'locked', registeredAt: '05/01/2024' },
  { id: 2875, name: 'Phạm Ngọc Lan',    email: 'lan.pham@gmail.com',      phone: '0934567890', role: 'customer', status: 'active', registeredAt: '18/02/2024' },
  { id: 2862, name: 'Hoàng Văn Bình',   email: 'binh.hv@rescue.vn',      phone: '0945678901', role: 'staff',    status: 'active', registeredAt: '01/03/2024' },
  { id: 2855, name: 'Vũ Thị Hằng',      email: 'hang.vt@gmail.com',       phone: '0956789012', role: 'customer', status: 'active', registeredAt: '22/03/2024' },
  { id: 2840, name: 'Đặng Quốc Tuấn',   email: 'tuan.dq@resilient.vn',   phone: '0967890123', role: 'admin',    status: 'active', registeredAt: '10/04/2024' },
  { id: 2833, name: 'Ngô Thị Thu',       email: 'thu.nt@gmail.com',        phone: '0978901234', role: 'customer', status: 'locked', registeredAt: '28/04/2024' },
  { id: 2820, name: 'Lý Hữu Khang',     email: 'khang.lh@rescue.vn',     phone: '0989012345', role: 'staff',    status: 'active', registeredAt: '15/05/2024' },
  { id: 2810, name: 'Bùi Thị Thanh',    email: 'thanh.bt@gmail.com',      phone: '0990123456', role: 'customer', status: 'active', registeredAt: '03/06/2024' },
  { id: 2795, name: 'Trịnh Văn Đức',    email: 'duc.tv@resilient.vn',    phone: '0901234568', role: 'staff',    status: 'active', registeredAt: '20/06/2024' },
  { id: 2780, name: 'Phan Thị Linh',    email: 'linh.pt@gmail.com',       phone: '0912345679', role: 'customer', status: 'locked', registeredAt: '08/07/2024' },
  { id: 2775, name: 'Người dùng Khách',  email: 'guest@example.com',       phone: '0988888888', role: 'guest',    status: 'active', registeredAt: '12/07/2024' },
];

const TOTAL_USERS = 1284; const TOTAL_ADMINS = 42; const TOTAL_STAFF = 156; const TOTAL_LOCKED = 8;
const PAGE_SIZE = 6;

function getInitials(name: string) {
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
}
const GRADIENTS = [
  'linear-gradient(135deg,#003fb1,#1e62e6)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#14b8a6,#3b82f6)',
];
const roleConfig: Record<string, { label: string; cls: string }> = {
  admin:    { label: 'Quản trị viên', cls: 'primary' },
  staff:    { label: 'Nhân viên',     cls: 'success' },
  customer: { label: 'Khách hàng',    cls: 'info' },
  guest:    { label: 'Khách vãng lai',cls: 'muted' },
};

function AddUserModal({ onClose, onAdd }: { onClose: () => void; onAdd: (u: AdminUser) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'customer' as AdminUser['role'] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Họ tên không được để trống';
    if (!form.email.includes('@')) e.email = 'Email không hợp lệ';
    if (form.phone.length < 10) e.phone = 'Số điện thoại không hợp lệ';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({ id: Math.floor(Math.random() * 1000) + 1000, ...form, status: 'active', registeredAt: new Date().toLocaleDateString('vi-VN') });
    onClose();
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="adm-modal-icon"><UserPlus size={18} /></div>
            <div>
              <div className="adm-modal-title">Thêm người dùng mới</div>
              <div className="adm-modal-subtitle">Điền thông tin để tạo tài khoản</div>
            </div>
          </div>
          <button className="adm-btn ghost icon-only" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {[
              { key: 'name', label: 'Họ và tên *', placeholder: 'Nguyễn Văn A' },
              { key: 'email', label: 'Email *', placeholder: 'example@email.com' },
              { key: 'phone', label: 'Số điện thoại *', placeholder: '09xxxxxxxx' },
            ].map(f => (
              <div key={f.key} className="adm-form-group">
                <label className="adm-form-label">{f.label}</label>
                <input
                  className={`adm-form-input${errors[f.key] ? ' error' : ''}`}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                />
                {errors[f.key] && <span className="adm-error-msg">{errors[f.key]}</span>}
              </div>
            ))}
            <div className="adm-form-group">
              <label className="adm-form-label">Vai trò</label>
              <select className="adm-form-input adm-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as AdminUser['role'] }))}>
                <option value="guest">Khách vãng lai</option>
                <option value="customer">Khách hàng</option>
                <option value="staff">Nhân viên cứu hộ</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="adm-btn primary"><UserPlus size={15} /> Tạo tài khoản</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ActionMenu({ user, onToggleLock, onDelete }: { user: AdminUser; onToggleLock: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="adm-btn ghost icon-only sm" onClick={() => setOpen(p => !p)}><MoreHorizontal size={15} /></button>
      {open && (
        <div onMouseLeave={() => setOpen(false)} style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 6,
          width: 180, background: '#fff', border: '1.5px solid rgba(0,63,177,0.1)',
          borderRadius: 14, boxShadow: '0 12px 32px rgba(0,63,177,0.15)',
          zIndex: 50, overflow: 'hidden', padding: 4
        }}>
          {[
            { icon: <Eye size={13} />, label: 'Xem chi tiết', action: () => { alert(`Xem: ${user.name}`); setOpen(false); } },
            { icon: <Edit2 size={13} />, label: 'Chỉnh sửa', action: () => { alert(`Sửa: ${user.name}`); setOpen(false); } },
            { icon: user.status === 'locked' ? <Unlock size={13} /> : <Lock size={13} />, label: user.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản', action: () => { onToggleLock(); setOpen(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#434654', borderRadius: 10,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div className="adm-divider" />
          <button onClick={() => { onDelete(); setOpen(false); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: '#dc2626', borderRadius: 10,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Trash2 size={13} /> Xóa
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q))
      && (roleFilter === 'all' || u.role === roleFilter)
      && (statusFilter === 'all' || u.status === statusFilter);
  }), [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleToggleLock(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'locked' ? 'active' : 'locked' } : u));
    toast.success('Đã cập nhật trạng thái tài khoản');
  }
  function handleDelete(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Đã xóa tài khoản thành công');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb"><span>Quản trị</span><span>/</span><span className="active">Tài khoản người dùng</span></div>
          <h1 className="adm-page-title">Quản lý tài khoản</h1>
          <p className="adm-page-subtitle">Theo dõi, phân quyền và quản lý trạng thái hoạt động của tất cả người dùng.</p>
        </div>
        <button className="adm-btn primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} /> Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Tổng người dùng', value: TOTAL_USERS.toLocaleString('vi-VN'), icon: Users, color: '#003fb1', bg: 'rgba(0,63,177,0.1)', trend: '+12%' },
          { label: 'Quản trị viên', value: TOTAL_ADMINS, icon: Shield, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Nhân viên cứu hộ', value: TOTAL_STAFF, icon: UserCheck, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Tài khoản bị khóa', value: String(TOTAL_LOCKED).padStart(2, '0'), icon: UserX, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="adm-stat-card">
              <div className="adm-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={22} /></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="adm-stat-value">{s.value}</div>
                  {(s as any).trend && <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: 8 }}>{(s as any).trend}</span>}
                </div>
                <div className="adm-stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="adm-card">
        {/* Filter Bar */}
        <div className="adm-filter-bar">
          <div className="adm-search-input-wrap" style={{ maxWidth: 340 }}>
            <Search size={16} />
            <input className="adm-search-input" placeholder="Tìm kiếm theo tên, email hoặc SĐT..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <select className="adm-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
            <option value="customer">Khách hàng</option>
            <option value="guest">Khách vãng lai</option>
          </select>
          <select className="adm-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">Trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
          <button className="adm-btn secondary icon-only" title="Bộ lọc nâng cao"><SlidersHorizontal size={16} /></button>
        </div>

        {/* Table */}
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>NGƯỜI DÙNG</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY ĐĂNG KÝ</th>
                <th style={{ textAlign: 'right' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="adm-empty"><Users size={44} /><p>Không tìm thấy người dùng phù hợp</p></div>
                </td></tr>
              ) : paginated.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700, color: '#737686' }}>#{user.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="adm-avatar" style={{ width: 38, height: 38, background: GRADIENTS[user.id % GRADIENTS.length], fontSize: 12 }}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#191c1e', fontSize: 13 }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: '#737686' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`adm-badge ${roleConfig[user.role].cls}`}>{roleConfig[user.role].label}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span className={`adm-status-dot ${user.status === 'active' ? 'online' : 'offline'}`} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: user.status === 'locked' ? '#dc2626' : '#191c1e' }}>
                        {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#737686', fontWeight: 600 }}>{user.registeredAt}</td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionMenu user={user} onToggleLock={() => handleToggleLock(user.id)} onDelete={() => handleDelete(user.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="adm-pagination">
          <span className="adm-pagination-info">
            Hiển thị <strong>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong> trong <strong>{TOTAL_USERS.toLocaleString('vi-VN')}</strong> kết quả
          </span>
          <div className="adm-page-btns">
            <button className="adm-page-btn" disabled={safePage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`adm-page-btn${safePage === p ? ' active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <span style={{ padding: '0 4px', color: '#737686' }}>…</span>
            <button className="adm-page-btn" onClick={() => setCurrentPage(Math.ceil(TOTAL_USERS / PAGE_SIZE))}>
              {Math.ceil(TOTAL_USERS / PAGE_SIZE)}
            </button>
            <button className="adm-page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={u => setUsers(prev => [u, ...prev])} />}
    </div>
  );
}
