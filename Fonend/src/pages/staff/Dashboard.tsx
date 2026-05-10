import { useState } from 'react';
import { MapPin, Phone, CheckCircle, Navigation, Play, AlertTriangle, Truck, CheckSquare, Square, Upload } from 'lucide-react';
import { mockRequests } from '../../data/mockData';

export default function StaffDashboard() {
  // Trạng thái màn hình: 'list' (Tìm cuốc) -> 'tracking' (Đang chạy) -> 'invoice' (Chốt đơn)
  const [view, setView] = useState<'list' | 'tracking' | 'invoice'>('list');
  const [activeRequest, setActiveRequest] = useState<any>(null);

  // Màn hình 1: Danh sách chờ (UC-21)
  if (view === 'list') {
    return (
      <div className="animate-fade-in flex-col gap-4" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="page-header mb-2">
          <h1>Yêu Cầu Gần Bạn</h1>
          <p>Nhận nhiệm vụ để bắt đầu ca làm việc.</p>
        </div>
        {mockRequests.filter(r => r.status === 'pending').map(req => (
          <div key={req.id} className="card hover:border-primary transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 style={{ fontSize: 18, color: 'var(--primary)' }}>Sự cố: {req.problemType}</h3>
                <div className="text-muted text-sm mt-1">{req.customerName} • {req.vehicleModel}</div>
              </div>
              <div className="badge badge-warning">Cách 2.5 km</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary mb-4">
              <MapPin size={14} /> {req.location.address}
            </div>
            <button className="btn btn-primary w-full justify-center" onClick={() => {
              setActiveRequest({ ...req, status: 'accepted' });
              setView('tracking');
            }}>
              Tiếp Nhận Nhiệm Vụ
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Màn hình 2: Đang xử lý & Cập nhật trạng thái (UC-23)
  if (view === 'tracking') {
    const statusSteps = [
      { key: 'accepted', label: 'Đã tiếp nhận', time: '14:25' },
      { key: 'dispatched', label: 'Bắt đầu di chuyển', time: '14:30' },
      { key: 'arrived', label: 'Đang đến hiện trường', time: 'Đang cập nhật...' },
      { key: 'in_progress', label: 'Đang xử lý sự cố', time: '' },
      { key: 'completed', label: 'Hoàn thành cứu hộ', time: '' },
    ];
    
    const handleNextStatus = () => {
      const order = ['accepted', 'dispatched', 'arrived', 'in_progress', 'completed'];
      const nextIdx = order.indexOf(activeRequest.status) + 1;
      if (nextIdx < order.length) {
        if (order[nextIdx] === 'completed') setView('invoice');
        else setActiveRequest({ ...activeRequest, status: order[nextIdx] });
      }
    };

    return (
      <div className="grid-2 animate-fade-in" style={{ gridTemplateColumns: '1fr 380px', height: 'calc(100vh - 80px)', gap: 20 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', background: '#1a1d26' }}>
           <div className="badge badge-primary" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, padding: '8px 16px' }}>
             <MapPin size={14} style={{ marginRight: 8 }} /> Khoảng cách: 2.4 km (8 phút)
           </div>
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span className="text-muted">Bản đồ di chuyển hiển thị tại đây</span>
           </div>
        </div>

        <div className="flex-col gap-4" style={{ overflowY: 'auto' }}>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Thông tin khách hàng</h3>
              <span className="badge badge-danger">CẦN HỖ TRỢ GẤP</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar-placeholder" style={{ width: 44, height: 44 }}>{activeRequest.customerName.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activeRequest.customerName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{activeRequest.vehiclePlate}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary flex-1 justify-center"><Phone size={14} /> Gọi điện</button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title mb-4">Cập nhật quy trình</h3>
            <div className="flex-col" style={{ position: 'relative', gap: 20 }}>
              <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 2, background: 'var(--border-strong)' }} />
              {statusSteps.map((step, index) => {
                const order = ['accepted', 'dispatched', 'arrived', 'in_progress', 'completed'];
                const currentIdx = order.indexOf(activeRequest.status);
                const isPassed = index <= currentIdx;
                const isCurrent = index === currentIdx;
                return (
                  <div key={step.key} className="flex items-start gap-4" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCurrent ? 'var(--primary)' : isPassed ? 'var(--success)' : 'var(--bg-elevated)', color: 'white'
                    }}>
                      {isPassed && !isCurrent ? <CheckCircle size={14} /> : <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: isCurrent ? 'var(--primary-light)' : 'var(--text-secondary)' }}>{step.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="btn btn-primary w-full justify-center mt-6" onClick={handleNextStatus} style={{ padding: 14 }}>
               Cập nhật bước tiếp theo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình 3: Xác nhận hoàn thành và tính phí (UC-24)
  return (
    <div className="animate-fade-in flex-col gap-4" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <div className="page-header flex justify-between items-center mb-2">
        <div>
          <h1>Xác nhận hoàn thành cứu hộ</h1>
          <p>Kiểm tra thông tin nhiệm vụ và gửi hóa đơn.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { alert('Đã gửi hóa đơn hoàn thành!'); setView('list'); }}>
          Xác nhận & Gửi hóa đơn
        </button>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 350px', gap: 20 }}>
        <div className="flex-col gap-4">
          <div className="card">
            <h3 className="card-title mb-4">Tóm tắt nhiệm vụ</h3>
            <div className="grid-2 mb-4">
               <div>
                 <div className="text-muted text-xs mb-1">KHÁCH HÀNG</div>
                 <div className="font-bold">{activeRequest.customerName}</div>
               </div>
               <div>
                 <div className="text-muted text-xs mb-1">PHƯƠNG TIỆN</div>
                 <div className="font-bold">{activeRequest.vehicleModel}</div>
               </div>
            </div>
            <div className="flex justify-between items-center bg-elevated p-3 rounded-md" style={{ background: 'var(--bg-elevated)', borderRadius: 8 }}>
               <div className="text-center"><div className="text-muted text-xs">TỔNG QUÃNG ĐƯỜNG</div><div className="font-bold text-lg text-primary">12.5 km</div></div>
               <div className="text-center"><div className="text-muted text-xs">THỜI GIAN THỰC HIỆN</div><div className="font-bold text-lg text-primary">45 phút</div></div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title mb-4">Ghi chú tình trạng xe sau cứu hộ</h3>
            <div className="grid-2 mb-4">
              <div className="flex items-center gap-2 p-2 border rounded-md" style={{ borderColor: 'var(--border)' }}><CheckSquare size={18} className="text-primary"/> Xe đã nổ máy bình thường</div>
              <div className="flex items-center gap-2 p-2 border rounded-md" style={{ borderColor: 'var(--border)' }}><Square size={18} className="text-muted"/> Cần thay ắc quy mới</div>
              <div className="flex items-center gap-2 p-2 border rounded-md" style={{ borderColor: 'var(--border)' }}><CheckSquare size={18} className="text-primary"/> Đã kiểm tra hệ thống sạc</div>
              <div className="flex items-center gap-2 p-2 border rounded-md" style={{ borderColor: 'var(--border)' }}><Square size={18} className="text-muted"/> Hỗ trợ di chuyển về Gara</div>
            </div>
            <textarea className="form-input" rows={3} placeholder="Nhập thêm ghi chú chi tiết..." />
          </div>
        </div>

        <div className="flex-col gap-4">
          <div className="card" style={{ border: '1px solid var(--primary)' }}>
             <h3 className="card-title mb-4">Chi tiết hóa đơn</h3>
             <div className="flex justify-between text-sm mb-2"><span className="text-secondary">Phí dịch vụ cơ bản</span><span>350.000đ</span></div>
             <div className="flex justify-between text-sm mb-4"><span className="text-secondary">Phí di chuyển (12.5km)</span><span>125.000đ</span></div>
             <div className="divider" />
             <div className="flex justify-between text-sm mb-2"><span className="text-secondary">Phụ phí ban đêm</span><span>50.000đ</span></div>
             <div className="divider" />
             <div className="flex justify-between items-center mt-4">
                <span className="text-muted">TỔNG THANH TOÁN</span>
                <span className="text-2xl font-bold text-primary">525.000đ</span>
             </div>
          </div>
          <div className="card">
             <h3 className="card-title mb-4">Hình ảnh minh chứng</h3>
             <div className="flex gap-2">
                <div style={{ width: 80, height: 80, background: 'var(--bg-elevated)', borderRadius: 8 }} />
                <div className="flex-col items-center justify-center" style={{ width: 80, height: 80, border: '1px dashed var(--border-strong)', borderRadius: 8, color: 'var(--text-muted)' }}>
                   <Upload size={20} />
                   <span style={{ fontSize: 10, marginTop: 4 }}>Thêm ảnh</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}