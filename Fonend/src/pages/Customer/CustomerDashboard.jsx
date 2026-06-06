import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Car, ClipboardList, Plus, Clock, CheckCircle, Truck, Info } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const statusBadge = {
  'pending': { label: 'Chờ tiếp nhận', variant: 'warning' },
  'in-progress': { label: 'Đang xử lý', variant: 'info' },
  'completed': { label: 'Hoàn thành', variant: 'success' },
  'cancelled': { label: 'Đã hủy', variant: 'danger' },
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ vehicles: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/customer/vehicles').catch(() => ({ data: [] })),
      axiosClient.get('/customer/rescue-requests').catch(() => ({ data: [] })),
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

  const activeReqs = data.requests.filter(r => r.status === 'pending' || r.status === 'in-progress');
  const pendingCount = activeReqs.length;
  const completedCount = data.requests.filter(r => r.status === 'completed').length;
  const recent = data.requests.slice(0, 5);

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
            Đặt cứu hộ
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
        <Link to="/customer/active-requests">
          <StatCard
            title="Đang xử lý"
            value={pendingCount}
            icon={Clock}
            iconBg="bg-[#FFFBEB]"
            iconColor="text-[#D97706]"
          />
        </Link>
        <Link to="/customer/history">
          <StatCard
            title="Đơn hoàn thành"
            value={completedCount}
            icon={CheckCircle}
            iconBg="bg-[#F0FDF4]"
            iconColor="text-[#22C55E]"
          />
        </Link>
        <Link to="/customer/history">
          <StatCard
            title="Tổng yêu cầu"
            value={data.requests.length}
            icon={ClipboardList}
            iconBg="bg-[#F8FAFC]"
            iconColor="text-[#64748B]"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Recent Requests */}
          <Card padding={false}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0F172A]">Yêu cầu gần đây</h2>
                <Link to="/customer/history" className="text-[#1D4ED8] text-sm font-semibold hover:text-[#1E40AF] transition-colors">
                  Xem tất cả →
                </Link>
              </div>
            </Card.Header>

            {recent.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Chưa có yêu cầu nào"
                description="Bạn chưa có yêu cầu cứu hộ nào. Đặt cứu hộ ngay khi cần nhé!"
                actionLabel="Đặt cứu hộ"
                onAction={() => navigate('/customer/rescue-requests/create')}
              />
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {recent.map(req => {
                  const cfg = statusBadge[req.status] || statusBadge['pending'];
                  const targetUrl = (req.status === 'completed' || req.status === 'cancelled') 
                    ? `/customer/history` 
                    : `/customer/active-requests`;
                  return (
                    <Link
                      key={req._id}
                      to={targetUrl}
                      className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Truck className="w-5 h-5 text-[#1D4ED8]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">{req.service || 'Yêu cầu cứu hộ'}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{new Date(req.date).toLocaleDateString('vi-VN')}</p>
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

        <div>
          <Card className="bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] border-none text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Hỗ trợ khẩn cấp 24/7</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào. Nếu cần gấp, vui lòng gọi tổng đài.
                </p>
                <Button variant="outline" className="bg-white text-[#1D4ED8] border-none w-full font-bold hover:bg-[#F8FAFC]">
                  Gọi 1900 1234
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
