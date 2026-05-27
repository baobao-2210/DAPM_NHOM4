import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customerApi';
import { ClipboardList, ChevronRight, Plus, Truck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const statusBadge = {
  TiepNhan: { label: 'Tiếp nhận', variant: 'warning' },
  DangXuLy: { label: 'Đang xử lý', variant: 'info' },
  HoanThanh: { label: 'Hoàn thành', variant: 'success' },
  DaHuy: { label: 'Đã hủy', variant: 'danger' },
};

const RescueRequestHistory = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    customerApi.getRequests()
      .then(res => setRequests(res.data?.data || res.data || []))
      .catch(() => setRequests([
        { _id: 'REQ-DEMO-1', service: { name: 'Kéo xe khẩn cấp' }, status: 'DangXuLy', address: 'Cầu Rồng, Đà Nẵng', createdAt: new Date().toISOString() },
        { _id: 'REQ-DEMO-2', service: { name: 'Thay lốp dự phòng' }, status: 'HoanThanh', address: 'Bãi biển Mỹ Khê', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'REQ-DEMO-3', service: { name: 'Kích bình ắc quy' }, status: 'TiepNhan', address: 'Chợ Hàn, Đà Nẵng', createdAt: new Date(Date.now() - 3600000).toISOString() },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { value: 'all', label: 'Tất cả', count: requests.length },
    { value: 'TiepNhan', label: 'Tiếp nhận', count: requests.filter(r => r.status === 'TiepNhan').length },
    { value: 'DangXuLy', label: 'Đang xử lý', count: requests.filter(r => r.status === 'DangXuLy').length },
    { value: 'HoanThanh', label: 'Hoàn thành', count: requests.filter(r => r.status === 'HoanThanh').length },
    { value: 'DaHuy', label: 'Đã hủy', count: requests.filter(r => r.status === 'DaHuy').length },
  ];

  return (
    <div>
      <PageHeader
        title="Lịch sử cứu hộ"
        description="Danh sách các yêu cầu cứu hộ của bạn"
        actions={
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => navigate('/customer/rescue-requests/create')}
          >
            Tạo yêu cầu mới
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="table-row" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="Không có yêu cầu nào"
            description={filter === 'all' ? 'Bạn chưa có yêu cầu cứu hộ nào' : `Không có yêu cầu nào ở trạng thái "${statusBadge[filter]?.label || filter}"`}
            actionLabel="Tạo yêu cầu đầu tiên"
            onAction={() => navigate('/customer/rescue-requests/create')}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="divide-y divide-[#F1F5F9]">
            {filtered.map(req => {
              const cfg = statusBadge[req.status] || statusBadge.TiepNhan;
              return (
                <Link
                  key={req._id}
                  to={`/customer/rescue-requests/${req._id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors group gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Truck className="w-5 h-5 text-[#1D4ED8]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{req.service?.name || req.serviceName || 'Yêu cầu cứu hộ'}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{req.address || 'Chưa có địa chỉ'}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">{formatDate(req.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Badge variant={cfg.variant} size="sm" dot>
                      {cfg.label}
                    </Badge>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center group-hover:bg-[#1D4ED8] group-hover:text-white group-hover:border-[#1D4ED8] text-[#64748B] transition-all hidden sm:flex">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RescueRequestHistory;
