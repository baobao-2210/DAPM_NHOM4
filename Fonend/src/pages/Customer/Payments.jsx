import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { CreditCard, FileText, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

const Payments = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    customerApi.getRequests()
      .then(res => {
        const data = res.data?.data || res.data || [];
        // Only consider completed requests for payment
        setRequests(data.filter(r => r.status === 'completed'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handlePay = async (req, method) => {
    try {
      await customerApi.payRequest(req._id, { method });
      toast.success(`Thanh toán ${method} thành công!`);
      fetchData();
    } catch (err) {
      if (!err.response) {
        toast.success(`Thanh toán ${method} thành công! (Demo)`);
        setRequests(requests.map(r => r._id === req._id ? { ...r, isPaid: true } : r));
      } else {
        toast.error(err.response?.data?.message || 'Thanh toán thất bại');
      }
    }
  };

  const pendingPayments = requests.filter(r => !r.isPaid);
  const paidHistory = requests.filter(r => r.isPaid);
  
  const totalSpent = paidHistory.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalPending = pendingPayments.reduce((sum, r) => sum + (r.total || 0), 0);

  const tabs = [
    { value: 'pending', label: 'Chờ thanh toán', count: pendingPayments.length },
    { value: 'history', label: 'Lịch sử thanh toán', count: paidHistory.length },
  ];

  const displayList = activeTab === 'pending' ? pendingPayments : paidHistory;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Thanh toán & Hóa đơn"
        description="Quản lý hóa đơn và thanh toán các dịch vụ cứu hộ của bạn."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card
  variant="default"
  className="mb-8 bg-[#1D4ED8] border-[#abbff5] text-white relative overflow-hidden"
>
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FBBF24]/10 rounded-full translate-y-1/2 -translate-x-1/4" />

  <div className="relative z-10 flex items-center justify-between">
    <div>
      <p className="text-black/80 text-sm font-medium mb-1">
        Tổng đã chi tiêu
      </p>

      <p className="text-3xl md:text-4xl font-bold text-black">
        {formatCurrency(totalSpent || 0)}
      </p>
    </div>

    <div className="text-5xl opacity-80">💳</div>
  </div>
</Card>
        <Card className="bg-white border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-[#64748B] font-medium text-sm uppercase tracking-wider">Chờ thanh toán</span>
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">{formatCurrency(totalPending)}</p>
        </Card>
        <Card className="bg-white border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[#64748B] font-medium text-sm uppercase tracking-wider">Tổng hóa đơn</span>
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">{requests.length}</p>
        </Card>
      </div>

      <div className="mb-6 overflow-x-auto">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} variant="card" className="h-24" />)}
        </div>
      ) : displayList.length === 0 ? (
        <Card>
          <EmptyState
            icon={CreditCard}
            title="Không có hóa đơn nào"
            description={activeTab === 'pending' ? 'Bạn không có khoản phí nào đang chờ thanh toán.' : 'Bạn chưa có lịch sử thanh toán nào.'}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {displayList.map(req => (
            <Card key={req._id} padding={true} className="flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow border-[#E2E8F0]">
              
              {/* Invoice Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#1D4ED8]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{req.service || 'Dịch vụ cứu hộ'}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-[#64748B]">
                    <span>Đơn: #{req._id}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(req.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Status & Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:ml-auto">
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold text-[#0F172A] mb-1">{formatCurrency(req.total)}</p>
                  {req.isPaid ? (
                    <Badge variant="success" className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Chưa thanh toán
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                {!req.isPaid && (
                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    <Button size="sm" onClick={() => handlePay(req, 'VNPay')} className="bg-[#005BAA] hover:bg-[#004A8B] text-white">
                      Thanh toán VNPay
                    </Button>
                    <Button size="sm" onClick={() => handlePay(req, 'Momo')} className="bg-[#A50064] hover:bg-[#850050] text-white">
                      Thanh toán Momo
                    </Button>
                  </div>
                )}
              </div>
              
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
