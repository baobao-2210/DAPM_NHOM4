import { useState, useMemo } from 'react';
import {
  Users, Shield, UserCheck, UserX, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, UserPlus, MoreHorizontal,
  Edit2, Trash2, Lock, Unlock, Eye, TrendingUp
} from 'lucide-react';

// ===================== DATA =====================
interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'locked';
  registeredAt: string;
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
];

const TOTAL_USERS = 1284;
const TOTAL_ADMINS = 42;
const TOTAL_STAFF = 156;
const TOTAL_LOCKED = 8;
const PAGE_SIZE = 4;
// ===================== HELPERS =====================
function getInitials(name: string) {
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
}

function getAvatarGradient(id: number) {
  const g = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
    'linear-gradient(135deg,#14b8a6,#3b82f6)',
    'linear-gradient(135deg,#f97316,#ec4899)',
  ];
  return g[id % g.length];
}

const roleLabels: Record<string, { label: string; cls: string }> = {
  admin:    { label: 'Quản trị viên', cls: 'role-admin' },
  staff:    { label: 'Nhân viên',     cls: 'role-staff' },
  customer: { label: 'Khách hàng',    cls: 'role-customer' },
};

// ===================== ADD USER MODAL =====================
interface AddUserModalProps { onClose: () => void; onAdd: (u: AdminUser) => void; }

function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
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
    const newUser: AdminUser = {
      id: Math.floor(Math.random() * 1000) + 1000,
      ...form,
      status: 'active',
      registeredAt: new Date().toLocaleDateString('vi-VN'),
    };
    onAdd(newUser);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal au-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="au-modal-icon"><UserPlus size={20} /></div>
            <div>
              <h2 className="modal-title">Thêm người dùng mới</h2>
              <p className="text-sm text-muted" style={{ marginTop: 2 }}>Điền thông tin để tạo tài khoản</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="example@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại *</label>
            <input className={`form-input ${errors.phone ? 'input-error' : ''}`} placeholder="09xxxxxxxx" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select className="form-input form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as AdminUser['role'] }))}>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên cứu hộ</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary"><UserPlus size={16} />Tạo tài khoản</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================== ACTION MENU =====================
interface ActionMenuProps { user: AdminUser; onToggleLock: () => void; onDelete: () => void; }

function ActionMenu({ user, onToggleLock, onDelete }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="au-action-wrap">
      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setOpen(p => !p)}>
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="au-action-menu" onMouseLeave={() => setOpen(false)}>
          <button onClick={() => { alert(`Xem chi tiết: ${user.name}`); setOpen(false); }}><Eye size={14} />Xem chi tiết</button>
          <button onClick={() => { alert(`Chỉnh sửa: ${user.name}`); setOpen(false); }}><Edit2 size={14} />Chỉnh sửa</button>
          <button onClick={() => { onToggleLock(); setOpen(false); }}>
            {user.status === 'locked' ? <><Unlock size={14} />Mở khóa</> : <><Lock size={14} />Khóa tài khoản</>}
          </button>
          <div className="au-menu-divider" />
          <button className="danger" onClick={() => { onDelete(); setOpen(false); }}><Trash2 size={14} />Xóa</button>
        </div>
      )}
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleToggleLock(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'locked' ? 'active' : 'locked' } : u));
  }

  function handleDelete(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  }

  // Build pagination: 1 2 3 … lastPage
  const paginationPages = useMemo<(number | '...')[]>(() => {
    const pages: (number | '...')[] = [];
    const DISPLAY_TOTAL = Math.ceil(TOTAL_USERS / PAGE_SIZE);
    if (DISPLAY_TOTAL <= 7) {
      for (let i = 1; i <= DISPLAY_TOTAL; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, '...', DISPLAY_TOTAL);
    }
    return pages;
  }, []);

  return (
    <div className="animate-fade-in au-page">
      {/* Breadcrumb */}
      <div className="au-breadcrumb">
        <span>Quản trị</span>
        <span className="au-bc-sep">›</span>
        <span className="au-bc-active">Tài khoản người dùng</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quản lý tài khoản</h1>
          <p>Theo dõi, phân quyền và quản lý trạng thái hoạt động của tất cả người dùng trong hệ thống cứu hộ.</p>
        </div>
        <button className="btn btn-primary" id="btn-add-user" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="au-stats-row">
        <div className="au-stat-card">
          <div className="au-stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
            <Users size={22} />
          </div>
          <div className="au-stat-body">
            <div className="au-stat-badge up"><TrendingUp size={11} />+12%</div>
            <div className="au-stat-value">{TOTAL_USERS.toLocaleString('vi-VN')}</div>
            <div className="au-stat-label">Tổng người dùng</div>
          </div>
        </div>

        <div className="au-stat-card">
          <div className="au-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
            <Shield size={22} />
          </div>
          <div className="au-stat-body">
            <div className="au-stat-value">{TOTAL_ADMINS}</div>
            <div className="au-stat-label">Quản trị viên</div>
          </div>
        </div>

        <div className="au-stat-card">
          <div className="au-stat-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            <UserCheck size={22} />
          </div>
          <div className="au-stat-body">
            <div className="au-stat-value">{TOTAL_STAFF}</div>
            <div className="au-stat-label">Nhân viên cứu hộ</div>
          </div>
        </div>

        <div className="au-stat-card">
          <div className="au-stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            <UserX size={22} />
          </div>
          <div className="au-stat-body">
            <div className="au-stat-value">{String(TOTAL_LOCKED).padStart(2, '0')}</div>
            <div className="au-stat-label">Tài khoản bị khóa</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filter Bar */}
        <div className="au-filter-bar">
          <div className="search-bar au-search">
            <Search size={16} />
            <input
              id="user-search"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="au-filter-right">
            <select id="role-filter" className="form-input form-select au-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
            </select>
            <select id="status-filter" className="form-input form-select au-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa</option>
            </select>
            <button className="btn btn-secondary btn-icon" title="Bộ lọc nâng cao">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NGƯỜI DÙNG</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY ĐĂNG KÝ</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                    <Users size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                    Không tìm thấy người dùng phù hợp
                  </td>
                </tr>
              ) : paginated.map(user => {
                const roleMeta = roleLabels[user.role];
                return (
                  <tr key={user.id}>
                    <td className="au-id">#{user.id}</td>
                    <td>
                      <div className="au-user-cell">
                        <div className="au-avatar" style={{ background: getAvatarGradient(user.id) }}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="au-user-name">{user.name}</div>
                          <div className="au-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`au-role-badge ${roleMeta.cls}`}>{roleMeta.label}</span>
                    </td>
                    <td>
                      <div className="au-status">
                        <span className={`status-dot ${user.status === 'active' ? 'online' : 'danger'}`} />
                        <span className={user.status === 'locked' ? 'text-danger' : ''} style={{ fontWeight: 500 }}>
                          {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </div>
                    </td>
                    <td className="au-date">{user.registeredAt}</td>
                    <td>
                      <ActionMenu
                        user={user}
                        onToggleLock={() => handleToggleLock(user.id)}
                        onDelete={() => handleDelete(user.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="au-pagination">
          <span className="au-pagination-info">
            Hiển thị {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filtered.length)} trong tổng số {TOTAL_USERS.toLocaleString('vi-VN')} người dùng
          </span>
          <div className="au-pager">
            <button className="au-page-btn" disabled={safePage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </button>
            {paginationPages.map((p, i) =>
              p === '...'
                ? <span key={`e${i}`} className="au-page-ellipsis">…</span>
                : <button key={p} className={`au-page-btn ${safePage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p as number)}>{p}</button>
            )}
            <button className="au-page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={u => setUsers(prev => [u, ...prev])} />}
    </div>
  );
}
