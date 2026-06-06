import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { DollarSign, TrendingUp, Calendar, CheckCircle, Wallet, History } from 'lucide-react';

const StaffIncome = () => {
  const { user } = useAuth();
  const [staffId, setStaffId] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idTaiKhoan = user?._id || user?.id;
    if (idTaiKhoan) {
      axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`)
        .then(res => setStaffId(res.data.idNhanVien))
        .catch(err => console.error(err));
    }
  }, [user]);

  const loadData = async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const now = new Date();
      const [metricsRes, historyRes] = await Promise.all([
        axiosClient.get(`/NhanVien/${staffId}/dashboard-metrics`),
        axiosClient.get(`/NhanVien/${staffId}/history?thang=${now.getMonth() + 1}&nam=${now.getFullYear()}`)
      ]);
      setMetrics(metricsRes.data);
      // Chỉ lấy các đơn đã hoàn thành để tính vào lịch sử thu nhập
      setHistoryData(historyRes.data.lichCuuHo?.filter(h => h.trangThaiHienTai === 'HoanThanh') || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <Loading fullscreen={false} />;

  return (
    <div className="font-['Inter']">
      <PageHeader
        title="Báo cáo thu nhập"
        description="Thống kê doanh thu từ các đơn cứu hộ đã hoàn thành."
      />

      {/* Thống kê thu nhập */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Thu nhập hôm nay"
          value={formatMoney(metrics?.thuNhapHomNay)}
          icon={Wallet} iconBg="bg-emerald-50" iconColor="text-emerald-600"
        />
        <StatCard
          title="Thu nhập tháng này"
          value={formatMoney(metrics?.thuNhapThang)}
          icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600"
        />
        <StatCard
          title="Tổng thu nhập"
          value={formatMoney(metrics?.tongThuNhap)}
          icon={DollarSign} iconBg="bg-purple-50" iconColor="text-purple-600"
        />
        <StatCard
          title="Tổng đơn hoàn thành"
          value={metrics?.donHoanThanh || 0}
          icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500"
        />
      </div>

      {/* Danh sách lịch sử thanh toán / hóa đơn tháng này */}
      <Card className="border border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
        <Card.Header className="bg-slate-50 border-b border-slate-100 py-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-800">Lịch sử thu nhập tháng này</h3>
          </div>
        </Card.Header>

        {historyData.length === 0 ? (
          <EmptyState icon={DollarSign} title="Chưa có dữ liệu" description="Bạn chưa hoàn thành đơn cứu hộ nào trong tháng này để tạo thu nhập." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Dịch vụ</th>
                  <th className="px-6 py-4">Ngày hoàn thành</th>
                  <th className="px-6 py-4 text-right">Chi phí thực tế</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">#{row.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{row.tenKhachHang}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{row.tenDichVu}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {row.ngayHoanThanh ? new Date(row.ngayHoanThanh).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600 text-right">
                      {row.chiPhiThucTe ? formatMoney(row.chiPhiThucTe) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StaffIncome;
