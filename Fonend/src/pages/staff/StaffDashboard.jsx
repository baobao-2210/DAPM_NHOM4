import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { ClipboardList, CheckCircle, Clock, Truck, DollarSign, Star, TrendingUp } from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  
  const [staffId, setStaffId] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Lấy staffId từ idTaiKhoan
  useEffect(() => {
    const idTaiKhoan = user?._id || user?.id;
    if (idTaiKhoan) {
      axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`)
        .then(res => setStaffId(res.data.idNhanVien))
        .catch(err => console.error("Lỗi lấy thông tin NV", err));
    }
  }, [user]);

  // 2. Fetch metrics
  useEffect(() => {
    if (!staffId) return;

    const fetchMetrics = async () => {
      try {
        const res = await axiosClient.get(`/NhanVien/${staffId}/dashboard-metrics`);
        setMetrics(res.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [staffId]);

  if (loading) return <Loading fullscreen={false} />;

  // Hàm format tiền
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div className="font-['Inter']">
      <PageHeader
        title={`Xin chào, ${user?.name || user?.hoTen || 'Nhân viên'}! 👋`}
        description="Tổng quan hiệu suất công việc và thu nhập của bạn"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Đơn hôm nay"
          value={metrics?.tongDonHomNay || 0}
          icon={ClipboardList} iconBg="bg-blue-50" iconColor="text-blue-600"
        />
        <StatCard
          title="Đơn chờ nhận"
          value={metrics?.donChoNhan || 0}
          icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500"
        />
        <StatCard
          title="Đơn đang xử lý"
          value={metrics?.donDangXuLy || 0}
          icon={Truck} iconBg="bg-purple-50" iconColor="text-purple-600"
        />
        <StatCard
          title="Đơn hoàn thành"
          value={metrics?.donHoanThanh || 0}
          icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Thu nhập hôm nay"
          value={formatMoney(metrics?.thuNhapHomNay)}
          icon={DollarSign} iconBg="bg-emerald-50" iconColor="text-emerald-600"
        />
        <StatCard
          title="Thu nhập tháng này"
          value={formatMoney(metrics?.thuNhapThang)}
          icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600"
        />
        <StatCard
          title="Đánh giá trung bình"
          value={`${metrics?.danhGiaTrungBinh || 0} / 5.0`}
          icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500"
        />
      </div>
      
      {/* Không gian mở rộng: Biểu đồ thu nhập hoặc Lịch sử gần đây */}
    </div>
  );
};

export default StaffDashboard;