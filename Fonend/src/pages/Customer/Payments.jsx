import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { CreditCard, FileText, CheckCircle2, Clock, Wallet } from 'lucide-react';

const MOCK_PAYMENTS = [
  {
    id: 'INV-2026-001',
    requestId: 'REQ-1234',
    service: 'Kéo xe cứu hộ',
    amount: 500000,
    date: '25/05/2026',
    status: 'paid',
    method: 'VNPay',
  },
  {
    id: 'INV-2026-002',
    requestId: 'REQ-1235',
    service: 'Kích bình ắc quy',
    amount: 150000,
    date: '25/05/2026',
    status: 'pending',
    method: null,
  },
  {
    id: 'INV-2026-003',
    requestId: 'REQ-1200',
    service: 'Vá lốp lưu động',
    amount: 100000,
    date: '20/05/2026',
    status: 'paid',
    method: 'Momo',
  },
];

const Payments = () => {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePay = (id, method) => {
    // Giả lập thanh toán
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'paid', method } : p));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Lịch sử thanh toán"
        description="Quản lý hóa đơn và thanh toán các dịch vụ cứu hộ của bạn."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1D4ED8] text-white">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Tổng đã chi tiêu</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(600000)}</p>
        </Card>
        <Card className="bg-white border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-[#64748B] font-medium text-sm uppercase tracking-wider">Chờ thanh toán</span>
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">{formatCurrency(150000)}</p>
        </Card>
        <Card className="bg-white border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[#64748B] font-medium text-sm uppercase tracking-wider">Tổng hóa đơn</span>
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">3</p>
        </Card>
      </div>

      <div className="space-y-4">
        {payments.map(payment => (
          <Card key={payment.id} padding={true} className="flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow border-[#E2E8F0]">
            
            {/* Invoice Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#1D4ED8]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] mb-1">{payment.service}</h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-[#64748B]">
                  <span className="font-medium text-[#0F172A]">{payment.id}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Đơn: {payment.requestId}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{payment.date}</span>
                </div>
              </div>
            </div>

            {/* Status & Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:ml-auto">
              <div className="text-left sm:text-right">
                <p className="text-xl font-bold text-[#0F172A] mb-1">{formatCurrency(payment.amount)}</p>
                {payment.status === 'paid' ? (
                  <Badge variant="success" className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã thanh toán qua {payment.method}
                  </Badge>
                ) : (
                  <Badge variant="warning" className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Chưa thanh toán
                  </Badge>
                )}
              </div>

              {/* Actions */}
              {payment.status === 'pending' && (
                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  <Button size="sm" onClick={() => handlePay(payment.id, 'VNPay')} className="bg-[#005BAA] hover:bg-[#004A8B] text-white">
                    Thanh toán VNPay
                  </Button>
                  <Button size="sm" onClick={() => handlePay(payment.id, 'Momo')} className="bg-[#A50064] hover:bg-[#850050] text-white">
                    Thanh toán Momo
                  </Button>
                </div>
              )}
            </div>
            
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;
