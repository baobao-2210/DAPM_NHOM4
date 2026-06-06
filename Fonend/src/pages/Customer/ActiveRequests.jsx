import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customerApi';
import { ClipboardList, ChevronRight, Plus, Truck, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const statusBadge = {
  'pending': { label: 'Chờ tiếp nhận', variant: 'warning' },
  'in-progress': { label: 'Đang xử lý', variant: 'info' },
};

const ActiveRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = () => {
      customerApi.getRequests()
        .then(res => {
          const data = res.data?.data || res.data || [];
          setRequests(data.filter(r => r.status === 'pending' || r.status === 'in-progress'));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchRequests();
    
    // Polling every 5 seconds
    const intervalId = setInterval(fetchRequests, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <PageHeader
        title="Đơn đang xử lý"
        description="Theo dõi trực tiếp quá trình cứu hộ của bạn"
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

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} variant="table-row" />)}
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <EmptyState
            icon={Clock}
            title="Không có đơn đang xử lý"
            description="Bạn hiện không có yêu cầu cứu hộ nào đang chờ xử lý."
            actionLabel="Đặt cứu hộ ngay"
            onAction={() => navigate('/customer/rescue-requests/create')}
          />
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map(req => {
            const cfg = statusBadge[req.status] || statusBadge['pending'];
            return (
              <Card key={req._id} variant="interactive" padding={false} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                        <Truck className="w-6 h-6 text-[#1D4ED8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-[#0F172A]">{req.service || 'Yêu cầu cứu hộ'}</h3>
                          <Badge variant={cfg.variant} size="sm" dot>{cfg.label}</Badge>
                        </div>
                        <p className="text-sm text-[#64748B] flex items-center gap-1">Mã đơn: #{req._id} • {formatDate(req.date)}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      onClick={() => navigate(`/customer/rescue-requests/${req._id}`)}
                    >
                      Xem chi tiết & Theo dõi
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveRequests;
