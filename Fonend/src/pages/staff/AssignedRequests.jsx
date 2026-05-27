import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ClipboardList, ChevronRight, Clock, Truck, CheckCircle, AlertCircle, MapPin, Calendar } from 'lucide-react';

const statusBadgeVariant = {
  Pending: 'warning',
  Assigned: 'primary',
  OnGoing: 'info',
  Completed: 'success',
};

const statusLabel = {
  Pending: 'Chờ xử lý',
  Assigned: 'Đã phân công',
  OnGoing: 'Đang xử lý',
  Completed: 'Hoàn thành',
};

const AssignedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    axiosClient.get('/staff/rescue-requests')
      .then(res => setRequests(res.data?.data || res.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'active'
    ? requests.filter(r => r.status !== 'Completed')
    : filter === 'completed'
    ? requests.filter(r => r.status === 'Completed')
    : requests;

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  const tabItems = [
    {
      value: 'active',
      label: 'Đang hoạt động',
      count: requests.filter(r => r.status !== 'Completed').length,
    },
    {
      value: 'completed',
      label: 'Hoàn thành',
      count: requests.filter(r => r.status === 'Completed').length,
    },
    {
      value: 'all',
      label: 'Tất cả',
      count: requests.length,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Đơn được giao"
        description="Danh sách yêu cầu cứu hộ được phân công cho bạn"
      />

      {/* Filter tabs */}
      <div className="mb-6">
        <Tabs
          tabs={tabItems}
          activeTab={filter}
          onChange={setFilter}
        />
      </div>

      {loading ? (
        <Loading fullscreen={false} />
      ) : filtered.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={ClipboardList}
            title="Không có đơn nào"
            description="Bạn đã hoàn thành tất cả các yêu cầu được giao"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const variant = statusBadgeVariant[req.status] || 'default';
            const label = statusLabel[req.status] || req.status;
            return (
              <Link
                key={req._id}
                to={`/staff/requests/${req._id}`}
                className="block"
              >
                <Card variant="interactive" className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                        🚗
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5">
                          <p className="text-sm font-bold text-[#0F172A]">{req.service?.name || 'Yêu cầu cứu hộ'}</p>
                          <Badge variant={variant} size="sm" dot>{label}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>{req.address || 'Chưa có địa chỉ'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                          <span className="bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                            KH: <strong className="text-[#0F172A]">{req.customer?.name || 'Khách hàng'}</strong>
                          </span>
                          {req.customer?.phone && (
                            <span className="bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                              📞 <strong className="text-[#0F172A]">{req.customer.phone}</strong>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center group-hover:bg-[#1D4ED8] group-hover:text-white group-hover:border-[#1D4ED8] text-[#64748B] transition-all self-end sm:self-auto hidden sm:flex flex-shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedRequests;
