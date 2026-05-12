import { Send, User } from 'lucide-react';

export default function StaffChat() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 120px)', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ borderRight: '1px solid #E2E8F0', padding: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Đoạn chat (UC-25)</h2>
        <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, borderLeft: '4px solid #1D4ED8', cursor: 'pointer' }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>Khách hàng cứu hộ</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Đang xử lý sự cố...</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#EFF6FF', color: '#1D4ED8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20}/></div>
          <div style={{ fontWeight: 700 }}>Khách hàng cứu hộ</div>
        </div>
        
        <div style={{ flex: 1, padding: 24, background: '#F8FAFC', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Chào anh, tôi bị hỏng lốp xe ở đường Lê Lợi.</div>
          <div style={{ alignSelf: 'flex-end', background: '#1D4ED8', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px' }}>Chào anh, tôi đang di chuyển tới hiện trường, khoảng 10 phút nữa tôi tới nhé.</div>
        </div>
        
        <div style={{ padding: 20, background: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
          <input style={{ flex: 1, padding: '12px 16px', background: '#F1F5F9', border: 'none', borderRadius: 24, outline: 'none' }} placeholder="Nhập tin nhắn hỗ trợ..." />
          <button style={{ width: 44, height: 44, background: '#1D4ED8', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}