import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SearchBox from '../../components/ui/SearchBox';
import Select from '../../components/ui/Select';
import { AlertTriangle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/Loading';

const STATUS_COLORS = {
  pending: { label: 'Chờ xử lý', variant: 'warning', icon: AlertTriangle },
  processing: { label: 'Đang giải quyết', variant: 'primary', icon: Clock },
  resolved: { label: 'Đã giải quyết', variant: 'success', icon: CheckCircle2 },
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // State to hold temporary resolution text
  const [resultTexts, setResultTexts] = useState({});

  const loadComplaints = async () => {
    try {
      const res = await adminApi.getComplaints();
      const rawData = res.data?.data || [];
      const mappedData = rawData.map(c => ({
        id: `KN${String(c._id).padStart(3, '0')}`,
        realId: c._id,
        title: c.loaiKhieuNai || 'Khiếu nại dịch vụ',
        customer: c.customerName || 'Khách hàng',
        customerPhone: c.customerPhone || 'Không có số',
        requestId: `YC${String(c.requestId).padStart(3, '0')}`,
        description: c.reason || 'Không có nội dung',
        date: new Date(c.date).toLocaleDateString('vi-VN'),
        status: c.status?.toLowerCase() === 'investigating' ? 'processing' : (c.status?.toLowerCase() || 'pending'),
        result: c.resolution || ''
      }));
      
      setComplaints(mappedData);
      
      // Init resultTexts
      const initTexts = {};
      mappedData.forEach(c => {
        initTexts[c.realId] = c.result || '';
      });
      setResultTexts(initTexts);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải danh sách khiếu nại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStatusChange = async (realId, newStatus) => {
    try {
      const backendStatus = newStatus === 'resolved' ? 'Resolved' : (newStatus === 'processing' ? 'Investigating' : 'Pending');
      const payload = { status: backendStatus };
      if (newStatus === 'resolved') {
        payload.resolution = resultTexts[realId] || '';
      }
      await adminApi.updateComplaintStatus(realId, payload);
      toast.success('Cập nhật trạng thái khiếu nại thành công');
      loadComplaints();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading fullscreen={false} />;

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

                    {/* Result Input Area */}
                    <div className="mb-6">
                      <p className="text-sm font-bold text-[#0F172A] mb-2">Kết quả xử lý:</p>
                      <textarea
                        className="w-full p-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm"
                        rows="3"
                        placeholder="Nhập ghi chú xử lý khiếu nại (hiển thị cho khách hàng)..."
                        value={resultTexts[complaint.realId] || ''}
                        onChange={(e) => setResultTexts({...resultTexts, [complaint.realId]: e.target.value})}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                      <span className="text-sm font-semibold text-[#0F172A] mr-2">Cập nhật trạng thái:</span>
                      {complaint.status !== 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(complaint.realId, 'pending')}>
                          Chờ xử lý
                        </Button>
                      )}
                      {complaint.status !== 'processing' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(complaint.realId, 'processing')} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                          Đang giải quyết
                        </Button>
                      )}
                      {complaint.status !== 'resolved' && (
                        <Button size="sm" onClick={() => handleStatusChange(complaint.realId, 'resolved')} className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
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
