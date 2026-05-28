import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import StarRating from '../../components/ui/StarRating';
import Badge from '../../components/ui/Badge';
import { Star, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';

// DỮ LIỆU TẠM (Dự phòng khi Backend C# chưa có API)
const MOCK_REVIEWS = [
  { id: 1, customerName: 'Trần Khách Hàng', rating: 5, date: '25/05/2026', comment: 'Đến rất nhanh, xử lý chuyên nghiệp!', service: 'Kích bình ắc quy' },
  { id: 2, customerName: 'Lê Văn Khách', rating: 4, date: '24/05/2026', comment: 'Phục vụ tốt, giá cả hợp lý.', service: 'Kéo xe cứu hộ' },
  { id: 3, customerName: 'Phạm Thị M', rating: 5, date: '22/05/2026', comment: 'Nhân viên nhiệt tình, vui vẻ.', service: 'Vá lốp lưu động' },
];

const StaffReviews = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [loading, setLoading] = useState(true);

  // Gọi API trực tiếp bằng useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idTaiKhoan = user?._id || user?.id;
        if (!idTaiKhoan) return;

        // 1. Lấy IdNhanVien
        const nvRes = await axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`);
        const staffId = nvRes.data.idNhanVien;

        // 2. Lấy data Profile (chứa điểm Trung bình)
        const profileRes = await axiosClient.get(`/NhanVien/${staffId}/profile`);
        setProfileData(profileRes.data);

        // 3. Thử lấy danh sách comment thật từ API mới
        try {
            const reviewRes = await axiosClient.get(`/NhanVien/${staffId}/reviews`);
            if (reviewRes.data && reviewRes.data.length > 0) {
                // Đổi format ngày tháng cho đẹp
                const formattedReviews = reviewRes.data.map(r => ({
                    ...r,
                    date: new Date(r.date).toLocaleDateString('vi-VN')
                }));
                setReviewsList(formattedReviews);
            }
        } catch (e) {
            console.log("API reviews chưa sẵn sàng, dùng dữ liệu mẫu thay thế.");
        }

      } catch (error) {
        console.error('Lỗi khi tải thông tin đánh giá', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Loading fullscreen={false} />;

  // Tính toán số liệu dựa trên DB thật
  const avgRating = profileData?.diemTb > 0 ? profileData.diemTb.toFixed(1) : "0.0";
  const totalCompleted = profileData?.thongKe?.tongDonHoanThanh || 0;
  
  const satisfactionRate = avgRating > 4.5 ? '98%' : avgRating > 4.0 ? '90%' : '85%';
  const quality = avgRating >= 4.5 ? 'Xuất sắc' : avgRating >= 4.0 ? 'Tốt' : 'Trung bình';

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Đánh giá từ khách hàng"
        description="Xem phản hồi và điểm đánh giá hiệu suất của bạn."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2 bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white flex flex-col items-center justify-center py-8 shadow-lg shadow-blue-900/20">
          <p className="text-white/80 font-medium mb-2 uppercase tracking-widest text-sm">Điểm trung bình</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-6xl font-black">{avgRating}</span>
            <span className="text-2xl text-white/60 font-bold pb-1">/ 5.0</span>
          </div>
          <StarRating value={Math.round(profileData?.diemTb || 0)} readOnly size="lg" />
          <p className="mt-4 text-white/80 text-sm">Hiệu suất dựa trên {totalCompleted} đơn đã hoàn thành</p>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Đơn hoàn thành"
            value={totalCompleted.toString()}
            icon={Star}
            iconBg="bg-yellow-100"
            iconColor="text-[#F59E0B]"
            trend="Uy tín"
            trendUp={true}
          />
          <StatCard
            title="Tỷ lệ hài lòng"
            value={satisfactionRate}
            icon={ThumbsUp}
            iconBg="bg-green-100"
            iconColor="text-[#22C55E]"
          />
          <StatCard
            title="Chất lượng"
            value={quality}
            icon={ShieldCheck}
            iconBg="bg-blue-100"
            iconColor="text-[#1D4ED8]"
            className="sm:col-span-2"
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#1D4ED8]" />
        Đánh giá gần đây
      </h3>

      <div className="space-y-4">
        {reviewsList.map(review => (
          <Card key={review.id} padding={true} className="hover:border-[#1D4ED8]/30 transition-colors shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#1D4ED8] font-bold">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] leading-tight">{review.customerName}</h4>
                    <p className="text-xs text-[#64748B]">{review.date}</p>
                  </div>
                </div>
                <p className="text-[#0F172A] text-sm mt-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#F1F5F9] italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <StarRating value={review.rating} readOnly size="sm" />
                <Badge variant="outline" className="bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/20">{review.service}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffReviews;