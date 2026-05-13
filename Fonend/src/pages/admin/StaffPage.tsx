import { useState } from 'react';
import { Search, Plus, Star, Phone, Mail, MapPin, Briefcase, CheckCircle, Shield } from 'lucide-react';
import { mockStaff } from '../../data/mockData';
import type { StaffStatus, StaffRole } from '../../types';

const statusLabel: Record<StaffStatus, string> = {
  available: 'Sẵn Sàng', busy: 'Đang Bận', offline: 'Ngoại Tuyến', on_break: 'Nghỉ Giải Lao',
};
const roleLabel: Record<StaffRole, string> = {
  leader: 'Trưởng Nhóm', senior: 'Kỹ Thuật Chính', staff: 'Nhân Viên', driver: 'Tài Xế',
};
const statusDot: Record<StaffStatus, string> = {
  available: 'online', busy: 'busy', offline: 'offline', on_break: 'busy',
};
const statusBadge: Record<StaffStatus, string> = {
  available: 'badge-success', busy: 'badge-warning', offline: 'badge-muted', on_break: 'badge-warning',
};


export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filtered = mockStaff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      || s.phone.includes(search)
      || s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchRole = filterRole === 'all' || s.role === filterRole;
    return matchSearch && matchStatus && matchRole;
  });


  const counts: Record<string, number> = {
    all: mockStaff.length,
    available: mockStaff.filter(s => s.status === 'available').length,
    busy: mockStaff.filter(s => s.status === 'busy').length,
    offline: mockStaff.filter(s => s.status === 'offline').length,
    on_break: mockStaff.filter(s => s.status === 'on_break').length,
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span>
            <span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Nhân viên</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản Lý Nhân Viên</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">
            Theo dõi trạng thái, hiệu suất và vị trí của đội ngũ cứu hộ trong thời gian thực.
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Thêm Nhân Viên
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 sm:p-6 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-white/50 backdrop-blur-md border-[var(--primary)]/10 shadow-[var(--shadow-md)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col gap-4 w-full xl:w-auto">
          {/* Role Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-[var(--text-muted)] uppercase mr-2 w-16">Vai trò:</span>
            {[
              { key: 'all', label: 'Tất Cả' },
              { key: 'leader', label: 'Trưởng Nhóm' },
              { key: 'senior', label: 'Kỹ Thuật Chính' },
              { key: 'staff', label: 'Nhân Viên' },
              { key: 'driver', label: 'Tài Xế' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all border ${
                  filterRole === tab.key 
                  ? 'bg-[var(--bg-dark)] text-white border-[var(--bg-dark)] shadow-sm' 
                  : 'bg-white text-[var(--text-sub)] border-[var(--border-strong)] hover:border-[var(--text-sub)] hover:bg-gray-50'
                }`}
                onClick={() => setFilterRole(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-[var(--text-muted)] uppercase mr-1 w-16">Trạng thái:</span>

          {[
            { key: 'all', label: 'Tất Cả' },
            { key: 'available', label: 'Sẵn Sàng', dot: 'bg-emerald-500' },
            { key: 'busy', label: 'Đang Bận', dot: 'bg-amber-500' },
            { key: 'on_break', label: 'Nghỉ', dot: 'bg-amber-500' },
            { key: 'offline', label: 'Ngoại Tuyến', dot: 'bg-gray-400' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${
                filterStatus === tab.key 
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-[var(--glow-primary)]' 
                : 'bg-white text-[var(--text-sub)] border-[var(--border-strong)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/[0.02]'
              }`}
              onClick={() => setFilterStatus(tab.key)}
            >
              {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                filterStatus === tab.key ? 'bg-white/20 text-white' : 'bg-[var(--bg-body)] text-[var(--text-muted)]'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
          </div>
        </div>

        <div className="relative w-full xl:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            placeholder="Tìm theo tên, SĐT, email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[var(--border-strong)] rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5 shadow-sm"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(staff => (
          <div key={staff.id} className="card p-6 flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 bg-white border-[var(--border-primary)] cursor-pointer">
            {/* Hover Glow Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/20 transition-all rounded-[var(--radius-lg)] z-0" />
            
            {/* Top section */}
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] font-black text-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {staff.name.split(' ').pop()?.[0] || staff.name[0]}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                    staff.status === 'available' ? 'bg-emerald-500' : 
                    staff.status === 'busy' || staff.status === 'on_break' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{staff.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      staff.status === 'available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      staff.status === 'busy' || staff.status === 'on_break' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {statusLabel[staff.status]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-[var(--bg-body)] px-2 py-0.5 rounded text-[var(--text-sub)]">
                      <Shield size={10} />
                      {roleLabel[staff.role]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-600 font-black text-sm border border-amber-100/50">
                <Star size={14} className="fill-amber-500" />
                {staff.rating}
              </div>
            </div>

            {/* Info list */}
            <div className="space-y-3 mb-6 flex-1 relative z-10">
              <div className="flex items-center gap-3 text-sm text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-body)] flex items-center justify-center group-hover:bg-[var(--primary)]/5 transition-colors">
                  <Phone size={14} className="text-[var(--primary)]" />
                </div>
                {staff.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-body)] flex items-center justify-center group-hover:bg-[var(--primary)]/5 transition-colors">
                  <Mail size={14} className="text-[var(--primary)]" />
                </div>
                {staff.email}
              </div>
              {staff.location && (
                <div className="flex items-center gap-3 text-sm text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-body)] flex items-center justify-center group-hover:bg-[var(--primary)]/5 transition-colors">
                    <MapPin size={14} className="text-[var(--primary)]" />
                  </div>
                  <span className="truncate">{staff.location.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-body)] flex items-center justify-center group-hover:bg-[var(--primary)]/5 transition-colors">
                  <Briefcase size={14} className="text-[var(--primary)]" />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {staff.specialization.map(spec => (
                    <span key={spec} className="bg-[var(--bg-body)] px-2 py-0.5 rounded text-[11px] font-bold text-[var(--text-muted)]">{spec}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[var(--border)] mt-auto relative z-10 flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[var(--bg-body)] text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition-all border border-[var(--border-strong)] hover:border-transparent">
                Chi Tiết
              </button>
              {staff.status === 'available' && (
                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-[var(--shadow-sm)] hover:shadow-[var(--glow-primary)] transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Phân Công
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
