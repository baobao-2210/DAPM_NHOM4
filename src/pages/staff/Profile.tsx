import { ShieldCheck, Settings, Upload, CheckCircle } from 'lucide-react';

export default function StaffProfile() {
  return (
    <div className="animate-fade-in flex-col gap-6" style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
      <div className="page-header">
        <h1>Cập nhật hồ sơ</h1>
        <p>Quản lý thông tin cá nhân và thiết lập dịch vụ cứu hộ của bạn.</p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        
        {/* THÔNG TIN CÁ NHÂN (UC-27) */}
        <div className="flex-col gap-4">
          <div className="card">
            <h3 className="card-title mb-4">Thông tin cơ bản</h3>
            <div className="flex items-center gap-4 mb-6">
               <div className="avatar-placeholder" style={{ width: 80, height: 80, fontSize: 28, borderRadius: 12 }}>Q</div>
               <div>
                 <h2 className="text-lg font-bold">Nguyễn Minh Quân</h2>
                 <div className="text-sm text-muted mb-1">ID: RES-8821</div>
                 <div className="flex items-center gap-1 text-xs text-success"><ShieldCheck size={12}/> Đã xác thực</div>
               </div>
            </div>
            <div className="form-group mb-4"><label className="form-label">Số điện thoại</label><input className="form-input" defaultValue="0908 123 456" /></div>
            <div className="form-group"><label className="form-label">Khu vực thường trú</label><input className="form-input" defaultValue="Quận 1, TP. HCM" /></div>
          </div>

          <div className="card">
            <h3 className="card-title mb-4">Quản lý phương tiện cứu hộ</h3>
            <div className="p-4 border rounded-md mb-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
              <div className="flex justify-between items-start mb-2">
                 <div>
                   <div className="badge badge-warning mb-2">XE CÔNG VỤ</div>
                   <div className="font-bold text-primary">Isuzu FVR 900 - Xe kéo hạng nặng</div>
                 </div>
                 <span className="text-xs text-success font-bold">● SẴN SÀNG</span>
              </div>
              <div className="text-sm text-secondary">Biển số: 51C - 889.22</div>
            </div>
            <button className="btn btn-secondary w-full justify-center"><Upload size={14}/> Cập nhật giấy tờ xe</button>
          </div>
        </div>

        {/* QUẢN LÝ DỊCH VỤ CUNG CẤP (UC-28) */}
        <div className="flex-col gap-4">
          <div className="card">
            <h3 className="card-title mb-4">Dịch vụ đang cung cấp</h3>
            <p className="text-sm text-muted mb-4">Bật/tắt các loại hình dịch vụ bạn có thể thực hiện để nhận đơn phù hợp.</p>
            
            <div className="flex-col gap-3">
              {[
                { name: 'Kéo xe chuyên dụng', active: true, price: '500.000đ' },
                { name: 'Kích bình Acquy', active: true, price: '150.000đ' },
                { name: 'Thay lốp dự phòng', active: true, price: '200.000đ' },
                { name: 'Sửa chữa lưu động', active: false, price: 'Thỏa thuận' },
              ].map(svc => (
                <div key={svc.name} className="flex items-center justify-between p-4 border rounded-md transition-all" 
                     style={{ borderColor: svc.active ? 'var(--primary)' : 'var(--border)', background: svc.active ? 'var(--primary-glow)' : 'var(--bg-surface)' }}>
                  <div>
                    <div className="font-bold text-sm" style={{ color: svc.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{svc.name}</div>
                    <div className="text-xs mt-1" style={{ color: svc.active ? 'var(--primary-light)' : 'var(--text-secondary)' }}>Giá cơ bản: {svc.price}</div>
                  </div>
                  {/* CSS Toggle switch giả lập */}
                  <div style={{ width: 44, height: 24, background: svc.active ? 'var(--primary)' : 'var(--border-strong)', borderRadius: 24, position: 'relative', cursor: 'pointer' }}>
                     <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: svc.active ? 23 : 3, transition: '0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="divider" />
            <button className="btn btn-primary w-full justify-center" style={{ padding: 14 }}>
               <CheckCircle size={16} /> Lưu cấu hình dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}