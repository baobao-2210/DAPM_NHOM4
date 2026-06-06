import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customerApi';
import { ClipboardList, ChevronRight, Truck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const statusBadge = {
  'completed': { label: 'Hoàn thành', variant: 'success' },
  'cancelled': { label: 'Đã hủy', variant: 'danger' },
};

const History = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    customerApi.getRequests()
      .then(res => {
        const data = res.data?.data || res.data || [];
        setRequests(data.filter(r => r.status === 'completed' || r.status === 'cancelled'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { value: 'all', label: 'Tất cả', count: requests.length },
    { value: 'completed', label: 'Hoàn thành', count: requests.filter(r => r.status === 'completed').length },
    { value: 'cancelled', label: 'Đã hủy', count: requests.filter(r => r.status === 'cancelled').length },
  ];

  return (
    <div>
      <PageHeader
        title="Lịch sử cứu hộ"
        description="Xem lại các đơn cứu hộ đã hoàn thành hoặc đã hủy"
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
            description={filter === 'all' ? 'Bạn chưa có lịch sử cứu hộ nào.' : `Không có yêu cầu nào ở trạng thái "${statusBadge[filter]?.label || filter}"`}
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="divide-y divide-[#F1F5F9]">
            {filtered.map(req => {
              const cfg = statusBadge[req.status] || statusBadge['completed'];
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
                      <p className="text-sm font-semibold text-[#0F172A]">{req.service || 'Yêu cầu cứu hộ'}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">Mã đơn: #{req._id}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">{formatDate(req.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right mr-2 hidden sm:block">
                      <p className="text-xs text-[#64748B] mb-0.5">Tổng chi phí</p>
                      <p className="text-sm font-bold text-[#0F172A]">{req.total?.toLocaleString('vi-VN')}đ</p>
                    </div>
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

export default History;
