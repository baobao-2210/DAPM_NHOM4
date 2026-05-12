import { useState } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, Send, User, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function StaffDashboard() {
  const { activeTaskQuery, pendingQuery, actions } = useStaffData();
  const [view, setView] = useState<'tracking' | 'invoice'>('tracking');
  const [invoiceNote, setInvoiceNote] = useState('');
  const [finalCost, setFinalCost] = useState(560000); // Giá trị mặc định

  const activeRequest = activeTaskQuery.data;
  const pendingList = pendingQuery.data || [];

  if (activeTaskQuery.isLoading || pendingQuery.isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Đang đồng bộ dữ liệu hệ thống...</div>;
  }

  // ================= CHẾ ĐỘ 1: KHI ĐANG RẢNH - CHỜ NHẬN ĐƠN (UC-21, 22) =================
  if (!activeRequest) {
    if (pendingList.length === 0) {
      return (
        <div className="animate-fade-in" style={{ maxWidth: 800, margin: '40px auto', textAlign: 'center' }}>
          <div style={{ background: 'white', padding: 48, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <AlertCircle size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Chưa có yêu cầu cứu hộ</h2>
            <p style={{ color: '#64748B' }}>Hệ thống đang quét các sự cố xung quanh khu vực của bạn. Vui lòng giữ ứng dụng mở.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Yêu Cầu Đang Chờ ({pendingList.length})</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pendingList.map((req: any) => (
            <div key={req.id} style={{ background: 'white', padding: 20, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>{req.loaiSuCo || 'Sự cố khẩn cấp'}</h3>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>Khách hàng: {req.tenKhachHang || 'Khách vãng lai'}</div>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14}/> {req.diaChi || 'Không rõ địa chỉ'}</div>
              </div>
              <button 
                onClick={() => actions.accept.mutate(req.id)}
                disabled={actions.accept.isPending}
                style={{ padding: '12px 24px', background: '#1D4ED8', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
              >
                {actions.accept.isPending ? 'Đang nhận...' : 'Nhận Nhiệm Vụ'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= CHẾ ĐỘ 2: ĐANG LÀM NHIỆM VỤ - CẬP NHẬT TRẠNG THÁI (UC-23) =================
  if (view === 'tracking') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, height: '100%' }}>
        <div style={{ background: '#1E293B', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>[Hệ thống Bản đồ GPS hiển thị tại đây]</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Thông tin khách hàng</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: '#EFF6FF', color: '#1D4ED8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}><User size={24}/></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{activeRequest.tenKhachHang || 'Khách hàng'}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>SĐT: {activeRequest.soDienThoai || '09xx xxx xxx'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: 10, background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 500, color: '#1D4ED8', cursor: 'pointer' }}><Phone size={16} /> Gọi điện</button>
              <button style={{ flex: 1, padding: 10, background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 500, color: '#1D4ED8', cursor: 'pointer' }}><MessageSquare size={16} /> Nhắn tin</button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Trạng thái nhiệm vụ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600, marginBottom: 4 }}>TÌNH TRẠNG HIỆN TẠI</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1E3A8A' }}>{activeRequest.trangThaiHienTai === 'accepted' ? 'Đang di chuyển đến khách' : activeRequest.trangThaiHienTai}</div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                actions.updateStatus.mutate({ id: activeRequest.id, status: 'arrived' });
                setView('invoice');
              }} 
              disabled={actions.updateStatus.isPending}
              style={{ width: '100%', padding: 14, background: '#1D4ED8', color: 'white', borderRadius: 8, border: 'none', fontWeight: 600, marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              {actions.updateStatus.isPending ? 'Đang cập nhật...' : <><MapPin size={18} /> Xác nhận: Đã đến hiện trường</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= CHẾ ĐỘ 3: CHỐT HÓA ĐƠN VÀ HOÀN THÀNH (UC-24) =================
  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Xác nhận hoàn thành cứu hộ</h1>
          <p style={{ color: '#64748B' }}>Kiểm tra thông tin chi tiết nhiệm vụ và chi phí trước khi gửi hóa đơn.</p>
        </div>
        <button 
          onClick={() => {
            actions.complete.mutate({ id: activeRequest.id, finalCost: finalCost });
            setView('tracking');
          }} 
          disabled={actions.complete.isPending}
          style={{ padding: '12px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 24, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          {actions.complete.isPending ? 'Đang xử lý...' : <>Hoàn thành & Gửi báo cáo <Send size={16} /></>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Thông tin hóa đơn</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>KHÁCH HÀNG</div><div style={{ fontSize: 15, fontWeight: 700 }}>{activeRequest.tenKhachHang}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>SỰ CỐ</div><div style={{ fontSize: 15, fontWeight: 700 }}>{activeRequest.loaiSuCo || 'Sửa chữa'}</div></div>
            </div>
            <div>
               <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>CHI PHÍ THỰC TẾ (VNĐ)</div>
               <input 
                  type="number" 
                  value={finalCost} 
                  onChange={(e) => setFinalCost(Number(e.target.value))}
                  style={{ width: '100%', padding: 12, fontSize: 18, fontWeight: 700, borderRadius: 8, border: '1px solid #CBD5E1' }} 
               />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Ghi chú tình trạng</h3>
            <textarea 
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              style={{ width: '100%', padding: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, outline: 'none', resize: 'none' }} 
              rows={4} 
              placeholder="Ghi chú chi tiết kết quả sửa chữa..." 
            />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <div style={{ background: '#1D4ED8', padding: '20px 24px', color: 'white' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Tổng kết</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>TỔNG CẦN THU</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#1D4ED8' }}>{new Intl.NumberFormat('vi-VN').format(finalCost)} ₫</span>
            </div>
            <div style={{ background: '#FEF9C3', padding: '12px 16px', borderRadius: 8, fontSize: 13, color: '#854D0E', fontWeight: 500 }}>
              Tiền thu trực tiếp từ khách hàng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}