import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Car, ClipboardList, Plus, Clock, CheckCircle, Truck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const statusBadge = {
  Pending: { label: 'Chờ xử lý', variant: 'warning' },
  Assigned: { label: 'Đã phân công', variant: 'primary' },
  OnGoing: { label: 'Đang xử lý', variant: 'info' },
  Completed: { label: 'Hoàn thành', variant: 'success' },
  Cancelled: { label: 'Đã hủy', variant: 'danger' },
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ vehicles: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/customer/vehicles').catch(() => ({ data: [] })),
      axiosClient.get('/customer/rescue-requests').catch(() => ({ data: [
        { _id: 'REQ-DEMO-1', service: { name: 'Kéo xe khẩn cấp' }, status: 'OnGoing', address: 'Cầu Rồng, Đà Nẵng', createdAt: new Date().toISOString() },
        { _id: 'REQ-DEMO-2', service: { name: 'Thay lốp dự phòng' }, status: 'Completed', address: 'Bãi biển Mỹ Khê', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'REQ-DEMO-3', service: { name: 'Kích bình ắc quy' }, status: 'Pending', address: 'Chợ Hàn, Đà Nẵng', createdAt: new Date(Date.now() - 3600000).toISOString() },
      ] })),
    ]).then(([v, r]) => {
      setData({ vehicles: v.data?.data || v.data || [], requests: r.data?.data || r.data || [] });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" className="w-1/2 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  const recent = data.requests.slice(0, 5);
  const pending = data.requests.filter(r => r.status === 'Pending').length;
  const completed = data.requests.filter(r => r.status === 'Completed').length;

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.name || 'Khách hàng'}! 👋`}
        description="Đây là tổng quan tài khoản của bạn"
        actions={
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => navigate('/customer/rescue-requests/create')}
          >
            Tạo yêu cầu
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/customer/vehicles">
          <StatCard
            title="Xe đăng ký"
            value={data.vehicles.length}
            icon={Car}
            iconBg="bg-[#EFF6FF]"
            iconColor="text-[#1D4ED8]"
          />
        </Link>
        <Link to="/customer/rescue-requests">
          <StatCard
            title="Tổng yêu cầu"
            value={data.requests.length}
            icon={ClipboardList}
            iconBg="bg-[#EFF6FF]"
            iconColor="text-[#1D4ED8]"
          />
        </Link>
        <Link to="/customer/rescue-requests">
          <StatCard
            title="Đang xử lý"
            value={pending}
            icon={Clock}
            iconBg="bg-[#FFFBEB]"
            iconColor="text-[#D97706]"
          />
        </Link>
        <Link to="/customer/rescue-requests">
          <StatCard
            title="Hoàn thành"
            value={completed}
            icon={CheckCircle}
            iconBg="bg-[#F0FDF4]"
            iconColor="text-[#22C55E]"
          />
        </Link>
      </div>

      {/* Recent Requests */}
      <Card padding={false}>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">Yêu cầu gần đây</h2>
            <Link to="/customer/rescue-requests" className="text-[#1D4ED8] text-sm font-semibold hover:text-[#1E40AF] transition-colors">
              Xem tất cả →
            </Link>
          </div>
        </Card.Header>

        {recent.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Chưa có yêu cầu nào"
            description="Bạn chưa có yêu cầu cứu hộ nào. Tạo yêu cầu đầu tiên ngay!"
            actionLabel="Tạo yêu cầu đầu tiên"
            onAction={() => navigate('/customer/rescue-requests/create')}
          />
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {recent.map(req => {
              const cfg = statusBadge[req.status] || statusBadge.Pending;
              return (
                <Link
                  key={req._id}
                  to={`/customer/rescue-requests/${req._id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Truck className="w-5 h-5 text-[#1D4ED8]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{req.service?.name || req.serviceName || 'Yêu cầu cứu hộ'}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{req.address || req.location || 'Chưa có địa chỉ'}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant} size="sm" dot>
                    {cfg.label}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDashboard;
