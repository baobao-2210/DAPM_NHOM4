import { CheckCircle, MapPin, Calendar } from 'lucide-react';
import { mockRequests } from '../../data/mockData';

export default function StaffHistory() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header mb-6">
        <h1>Lịch Sử Hoạt Động</h1>
        <p>Thống kê các nhiệm vụ cứu hộ bạn đã hoàn thành.</p>
      </div>
      <div className="flex-col gap-4">
        {mockRequests.filter(r => r.status === 'completed').map(req => (
          <div key={req.id} className="card flex justify-between items-center">
            <div className="flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted"><Calendar size={14}/> 24/05/2024 - 14:25</div>
              <div className="font-bold text-lg text-primary">{req.problemType} - {req.customerName}</div>
              <div className="flex items-center gap-1 text-sm text-secondary"><MapPin size={14}/> {req.location.address}</div>
            </div>
            <div className="text-right">
              <div className="badge badge-success mb-2"><CheckCircle size={12} style={{marginRight:4}}/> Hoàn Thành</div>
              <div className="font-bold text-lg">{req.cost ? new Intl.NumberFormat('vi-VN').format(req.cost) + 'đ' : '0đ'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}