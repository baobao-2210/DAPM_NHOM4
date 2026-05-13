import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

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
  role: 'admin' | 'staff' | 'customer' | 'guest';
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
  { id: 2775, name: 'Người dùng Khách',  email: 'guest@example.com',       phone: '0988888888', role: 'guest',    status: 'active', registeredAt: '12/07/2024' },
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
  guest:    { label: 'Khách vãng lai',cls: 'role-guest' },
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
              <option value="guest">Khách vãng lai</option>
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
    toast.success('Đã cập nhật trạng thái tài khoản');
  }

  function handleDelete(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Đã xóa tài khoản thành công');
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
    <div className="animate-fade-in space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span>
            <span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Tài khoản người dùng</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý tài khoản</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">
            Theo dõi, phân quyền và quản lý trạng thái hoạt động của tất cả người dùng trong hệ thống cứu hộ chuyên nghiệp RescueGuard.
          </p>
        </div>
        <button className="btn btn-primary" id="btn-add-user" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} />
          Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng người dùng', value: TOTAL_USERS.toLocaleString('vi-VN'), icon: Users, color: 'var(--primary)', trend: '+12%' },
          { label: 'Quản trị viên', value: TOTAL_ADMINS, icon: Shield, color: 'var(--warning)' },
          { label: 'Nhân viên cứu hộ', value: TOTAL_STAFF, icon: UserCheck, color: 'var(--success)' },
          { label: 'Tài khoản bị khóa', value: String(TOTAL_LOCKED).padStart(2, '0'), icon: UserX, color: 'var(--danger)' },
        ].map((s, idx) => (
          <div key={idx} className="card p-6 flex items-start gap-5 group relative overflow-hidden">
            {/* Blue glowing border effect on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/20 transition-all rounded-[var(--radius-lg)]" />
            
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
              style={{ color: s.color, background: idx === 0 ? 'var(--primary-soft)' : 'var(--bg-body)' }}
            >
              <s.icon size={28} />
            </div>
            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-[var(--text-main)] leading-none">{s.value}</span>
                {s.trend && <span className="text-[10px] font-black text-[var(--success)] bg-green-50 px-1.5 py-0.5 rounded-md">{s.trend}</span>}
              </div>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden border-[var(--primary)]/10 shadow-[var(--shadow-md)]">

        {/* Filter Bar */}
        <div className="p-6 border-b border-[var(--border)] flex flex-col lg:flex-row gap-4 items-center justify-between bg-[var(--bg-body)]/50">
          <div className="relative w-full lg:w-1/2 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input
              id="user-search"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              className="w-full bg-white border border-[var(--border)] rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select 
              id="role-filter" 
              className="bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-all flex-1 lg:flex-none min-w-[160px]"
              value={roleFilter} 
              onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
              <option value="guest">Khách vãng lai</option>
            </select>
            <select 
              id="status-filter" 
              className="bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-all flex-1 lg:flex-none min-w-[140px]"
              value={statusFilter} 
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa</option>
            </select>
            <button className="p-3 bg-white border border-[var(--border)] rounded-2xl text-[var(--text-sub)] hover:text-[var(--primary)] transition-all">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-20">ID</th>
                <th>NGƯỜI DÙNG</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY ĐĂNG KÝ</th>
                <th className="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-[var(--text-muted)]">
                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Không tìm thấy người dùng phù hợp</p>
                  </td>
                </tr>
              ) : paginated.map(user => {
                const roleMeta = roleLabels[user.role];
                return (
                  <tr key={user.id} className="hover:bg-[var(--bg-body)]/50 transition-colors group">
                    <td className="font-bold text-[var(--text-muted)]">#{user.id}</td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-110 transition-transform" 
                          style={{ background: getAvatarGradient(user.id) }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-black text-[var(--text-main)]">{user.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                        user.role === 'staff' ? 'bg-emerald-100 text-emerald-700' :
                        user.role === 'guest' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {roleMeta.label}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--danger)]'}`} />
                        <span className={`text-sm font-bold ${user.status === 'locked' ? 'text-[var(--danger)]' : 'text-[var(--text-main)]'}`}>
                          {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-[var(--text-sub)]">{user.registeredAt}</td>
                    <td className="text-right">
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
        <div className="p-6 bg-[var(--bg-body)]/30 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Hiển thị <span className="text-[var(--text-main)]">{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filtered.length)}</span> trong <span className="text-[var(--text-main)]">{TOTAL_USERS.toLocaleString('vi-VN')}</span> kết quả
          </span>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-sub)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              disabled={safePage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {paginationPages.map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} className="px-2 text-[var(--text-muted)]">...</span>
                  : <button 
                      key={p} 
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                        safePage === p 
                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' 
                        : 'bg-white border border-[var(--border)] text-[var(--text-sub)] hover:border-[var(--primary)]/30'
                      }`}
                      onClick={() => setCurrentPage(p as number)}
                    >
                      {p}
                    </button>
              )}
            </div>
            <button 
              className="p-2 rounded-xl border border-[var(--border)] bg-white text-[var(--text-sub)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              disabled={safePage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={u => setUsers(prev => [u, ...prev])} />}
    </div>
  );
}
