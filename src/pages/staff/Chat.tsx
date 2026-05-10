import { Search, Image, Send, Phone, MapPin, Navigation } from 'lucide-react';

export default function StaffChat() {
  return (
    <div className="card animate-fade-in" style={{ padding: 0, display: 'grid', gridTemplateColumns: '300px 1fr 280px', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      
      {/* CỘT TRÁI: DANH SÁCH CHAT */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <h2 className="card-title mb-4">Tin nhắn cứu hộ</h2>
          <div className="search-bar w-full"><Search size={15} /><input placeholder="Tìm kiếm hội thoại..." /></div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          <div className="flex items-center gap-3 p-3 rounded-md" style={{ background: 'var(--bg-card-hover)', cursor: 'pointer' }}>
            <div className="avatar-placeholder" style={{ width: 40, height: 40 }}>N</div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between"><span className="font-bold text-sm">Nguyễn Văn Nam</span><span className="text-xs text-muted">Vừa xong</span></div>
              <div className="text-xs text-primary mt-1">Đã gửi vị trí GPS...</div>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT GIỮA: KHUNG CHAT */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg-base)' }}>
        <div className="flex items-center justify-between p-4" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
           <div className="flex items-center gap-3">
             <div className="avatar-placeholder" style={{ width: 40, height: 40 }}>N</div>
             <div><div className="font-bold">Nguyễn Văn Nam</div><div className="text-xs text-success">● Đang trực tuyến • Mã: RG-4921</div></div>
           </div>
           <div className="flex gap-2"><button className="btn btn-ghost btn-icon"><Phone size={18} /></button></div>
        </div>
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
           <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '75%', fontSize: 14 }}>
             Chào bạn, xe tôi bị nổ lốp tại cao tốc Long Thành - Dầu Giây. Đang đứng ở làn khẩn cấp km 24.
           </div>
           <div style={{ alignSelf: 'flex-end', background: 'var(--primary)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '75%', fontSize: 14 }}>
             Chào anh Nam, hệ thống đã nhận thông tin. Đội cứu hộ đang tới. Anh vui lòng bật đèn cảnh báo nhé.
           </div>
        </div>
        <div className="p-4" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-icon"><Image size={20} /></button>
            <input className="form-input flex-1" placeholder="Nhập tin nhắn..." style={{ borderRadius: 20 }} />
            <button className="btn btn-primary btn-icon" style={{ borderRadius: '50%' }}><Send size={18} /></button>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN NHANH */}
      <div className="p-5" style={{ background: 'var(--bg-surface)' }}>
        <div className="text-xs text-muted font-bold mb-4">THÔNG TIN CỨU HỘ</div>
        <div className="flex-col gap-4">
          <div className="flex gap-3"><MapPin size={16} className="text-primary mt-1" /><div><div className="text-xs text-muted">Trạng thái</div><div className="badge badge-warning mt-1">ĐANG XỬ LÝ</div></div></div>
          <div className="flex gap-3"><Truck size={16} className="text-muted mt-1" /><div><div className="text-xs text-muted">Phương tiện</div><div className="font-bold text-sm">Mercedes C200</div><div className="text-xs text-secondary">51H-123.45</div></div></div>
          <button className="btn btn-danger w-full justify-center mt-4 text-sm">Hủy Yêu Cầu</button>
        </div>
      </div>
    </div>
  );
}