import { useState, useEffect } from 'react';
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

  if (profileQuery.isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải hồ sơ...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Quản lý Hồ Sơ & Dịch Vụ</h1>
      <p style={{ color: '#64748B', marginBottom: 24 }}>Cập nhật thông tin và các dịch vụ bạn cung cấp (UC-27, UC-28)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Thông tin cá nhân (UC-27)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>HỌ VÀ TÊN</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>SỐ ĐIỆN THOẠI</label>
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>EMAIL</label>
              <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }} />
            </div>
            <button onClick={handleSaveProfile} disabled={actions.updateProfile.isPending} style={{ padding: '12px', background: '#0F172A', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>
              {actions.updateProfile.isPending ? 'Đang lưu...' : 'Lưu Thông Tin'}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Dịch vụ cung cấp (UC-28)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(svc => (
              <div key={svc.id} style={{ border: `2px solid ${svc.active ? '#1D4ED8' : '#E2E8F0'}`, padding: 16, borderRadius: 12, background: svc.active ? '#EFF6FF' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{svc.name}</span>
                <button onClick={() => toggleService(svc.id)} style={{ padding: '6px 12px', background: svc.active ? '#1D4ED8' : '#E2E8F0', color: svc.active ? 'white' : '#64748B', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                  {svc.active ? 'Đang bật' : 'Đang tắt'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}