import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SearchBox from '../../components/ui/SearchBox';
import Select from '../../components/ui/Select';
import { AlertTriangle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_COMPLAINTS = [
  {
    id: 'CMP-101',
    customer: 'Trần Khách Hàng',
    customerPhone: '0901234567',
    requestId: 'REQ-1234',
    title: 'Nhân viên đến muộn 30 phút',
    description: 'Nhân viên A hẹn 15p nhưng 45p mới tới, thái độ không tốt.',
    status: 'pending',
    date: '25/05/2026 14:30',
  },
  {
    id: 'CMP-100',
    customer: 'Lê Văn Khách',
    customerPhone: '0987654321',
    requestId: 'REQ-1200',
    title: 'Phí dịch vụ thu cao hơn báo giá',
    description: 'Trên app báo 200k nhưng nhân viên thu 250k.',
    status: 'processing',
    date: '20/05/2026 09:15',
  },
  {
    id: 'CMP-099',
    customer: 'Nguyễn Văn C',
    customerPhone: '0911223344',
    requestId: 'REQ-1150',
    title: 'Sửa không dứt điểm',
    description: 'Mới đi được 2km lại bị hỏng tiếp chỗ cũ.',
    status: 'resolved',
    date: '15/05/2026 16:45',
  },
];

const STATUS_COLORS = {
  pending: { label: 'Chờ xử lý', variant: 'warning', icon: AlertTriangle },
  processing: { label: 'Đang giải quyết', variant: 'primary', icon: Clock },
  resolved: { label: 'Đã giải quyết', variant: 'success', icon: CheckCircle2 },
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Đã cập nhật trạng thái khiếu nại ${id}`);
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Quản lý khiếu nại"
        description="Theo dõi và giải quyết các vấn đề, khiếu nại từ khách hàng."
      />

      <Card padding={true} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBox 
              placeholder="Tìm kiếm mã, tên KH, tiêu đề..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ xử lý' },
                { value: 'processing', label: 'Đang giải quyết' },
                { value: 'resolved', label: 'Đã giải quyết' },
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card padding={true} className="text-center py-12 text-[#64748B]">
            Không tìm thấy khiếu nại nào phù hợp.
          </Card>
        ) : (
          filteredComplaints.map(complaint => {
            const StatusIcon = STATUS_COLORS[complaint.status].icon;
            const isExpanded = expandedId === complaint.id;

            return (
              <Card key={complaint.id} padding={false} className="overflow-hidden border-[#E2E8F0]">
                {/* Header / Summary */}
                <div 
                  className={`p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isExpanded ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      complaint.status === 'pending' ? 'bg-red-50 text-red-500' :
                      complaint.status === 'processing' ? 'bg-blue-50 text-blue-500' :
                      'bg-green-50 text-green-500'
                    }`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A]">{complaint.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748B] mt-1">
                        <span className="font-semibold text-[#1D4ED8]">{complaint.id}</span>
                        <span>•</span>
                        <span>{complaint.customer}</span>
                        <span>•</span>
                        <span>{complaint.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto pl-14 md:pl-0">
                    <Badge variant={STATUS_COLORS[complaint.status].variant}>
                      {STATUS_COLORS[complaint.status].label}
                    </Badge>
                    <ChevronDown className={`w-5 h-5 text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 md:p-6 border-t border-[#E2E8F0] bg-white animate-[fadeIn_0.2s_ease-out]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
                        <p className="text-xs font-bold text-[#64748B] uppercase mb-1">Khách hàng</p>
                        <p className="font-semibold text-[#0F172A]">{complaint.customer}</p>
                        <p className="text-sm text-[#1D4ED8]">{complaint.customerPhone}</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
                        <p className="text-xs font-bold text-[#64748B] uppercase mb-1">Mã đơn liên quan</p>
                        <p className="font-semibold text-[#0F172A]">{complaint.requestId}</p>
                        <p className="text-sm text-[#1D4ED8] underline cursor-pointer">Xem chi tiết đơn</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-bold text-[#0F172A] mb-2">Nội dung khiếu nại:</p>
                      <p className="text-[#334155] text-sm leading-relaxed p-4 bg-red-50/30 rounded-xl border border-red-100">
                        {complaint.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                      <span className="text-sm font-semibold text-[#0F172A] mr-2">Cập nhật trạng thái:</span>
                      {complaint.status !== 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(complaint.id, 'pending')}>
                          Chờ xử lý
                        </Button>
                      )}
                      {complaint.status !== 'processing' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(complaint.id, 'processing')} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                          Đang giải quyết
                        </Button>
                      )}
                      {complaint.status !== 'resolved' && (
                        <Button size="sm" onClick={() => handleStatusChange(complaint.id, 'resolved')} className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                          Hoàn tất giải quyết
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;
