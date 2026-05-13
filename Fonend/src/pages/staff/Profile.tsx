import { useState, useEffect } from 'react';
import { User, Mail, Phone, Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function StaffProfile() {
  const { profileQuery, actions } = useStaffData();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [services, setServices] = useState([
    { id: '1', name: 'Kéo xe', active: true },
    { id: '2', name: 'Kích bình', active: false },
    { id: '3', name: 'Thay lốp', active: true }
  ]);

  useEffect(() => {
    if (profileQuery.data) {
      setFormData({
        name: profileQuery.data.tenNhanVien || '',
        phone: profileQuery.data.soDienThoai || '',
        email: profileQuery.data.email || ''
      });
    }
  }, [profileQuery.data]);

  const handleSaveProfile = () => {
    actions.updateProfile.mutate(formData);
  };

  const toggleService = (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setServices(updated);
    actions.updateServices.mutate(updated);
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Nhân Viên</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Hồ Sơ Của Tôi</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý Hồ sơ & Dịch vụ</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Cập nhật thông tin cá nhân và thiết lập các dịch vụ cứu hộ mà bạn có thể cung cấp.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white bg-gradient-to-br from-[var(--primary)] to-blue-600 shadow-lg shadow-[var(--primary)]/20">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-main)]">Thông tin cá nhân</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Cập nhật danh tính của bạn</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Họ Và Tên</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5" 
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Số Điện Thoại</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5" 
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Địa Chỉ Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5" 
                />
              </div>
            </div>
            
            <button 
              onClick={handleSaveProfile} 
              disabled={actions.updateProfile.isPending} 
              className="btn btn-primary w-full py-3.5 mt-4 text-sm font-bold shadow-md"
            >
              {actions.updateProfile.isPending ? 'Đang lưu...' : 'Lưu Thông Tin Cá Nhân'}
            </button>
          </div>
        </div>

        {/* Services Provided */}
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-main)]">Dịch vụ cung cấp</h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Quản lý khả năng hỗ trợ</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {services.map(svc => (
              <div 
                key={svc.id} 
                className={`border-2 p-5 rounded-2xl flex justify-between items-center transition-all ${
                  svc.active 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm' 
                    : 'border-[var(--border)] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${svc.active ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-body)] text-[var(--text-muted)]'}`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className={`font-black text-base ${svc.active ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'}`}>{svc.name}</div>
                    <div className="text-xs font-bold text-[var(--text-muted)]">{svc.active ? 'Sẵn sàng nhận yêu cầu' : 'Tạm ngưng phục vụ'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleService(svc.id)} 
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${svc.active ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]/30'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${svc.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              Hãy bật các dịch vụ mà bạn có đủ trang thiết bị và kỹ năng để thực hiện. Hệ thống sẽ phân bổ yêu cầu tự động dựa trên thiết lập này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}