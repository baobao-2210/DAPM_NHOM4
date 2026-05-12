import { Calendar, MapPin, CheckCircle, Search } from 'lucide-react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function StaffHistory() {
  const { historyQuery } = useStaffData();
  const historyData = historyQuery.data || [];

  if (historyQuery.isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải lịch sử cứu hộ...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>Lịch sử hoạt động</h1>
          <p style={{ color: '#64748B' }}>Xem lại các nhiệm vụ cứu hộ bạn đã hoàn thành.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: 8, width: 280 }}>
          <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <input placeholder="Tìm kiếm..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {historyData.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B', background: 'white', borderRadius: 12 }}>Chưa có lịch sử làm việc nào.</div>
        ) : (
          historyData.map((req: any) => (
            <div key={req.id} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{req.tenKhachHang}</span>
                    <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> Hoàn thành</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} color="#94A3B8"/> {req.diaChi}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>THU NHẬP</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>{req.chiPhiThucTe ? new Intl.NumberFormat('vi-VN').format(req.chiPhiThucTe) + ' ₫' : '0 ₫'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}