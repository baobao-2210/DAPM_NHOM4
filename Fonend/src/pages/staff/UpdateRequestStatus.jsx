import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { ChevronLeft, MapPin, CheckCircle, AlertCircle, Phone, User, Wrench, Navigation, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusBadgeVariant = {
  Pending: 'warning',
  Assigned: 'primary',
  OnGoing: 'info',
  Completed: 'success',
};

const statusLabel = {
  Pending: 'Chờ nhận',
  Assigned: 'Đã phân công',
  OnGoing: 'Đang xử lý',
  Completed: 'Hoàn thành',
};

const subStatusLabel = {
  DangDen: 'Đang di chuyển đến',
  DangSua: 'Đang tiến hành sửa chữa',
  DangKiemTra: 'Đang nghiệm thu kiểm tra',
};

const UpdateRequestStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [staffId, setStaffId] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  
  // State phục vụ cho việc nhập hóa đơn hoàn thành đơn hàng
  const [actualCost, setActualCost] = useState('');

  // 1. Lấy thông tin StaffId và Chi tiết Đơn hàng từ DB C#
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const idTaiKhoan = user?._id || user?.id;
        if (!idTaiKhoan) return;

        const nvRes = await axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`);
        const sId = nvRes.data.idNhanVien;
        setStaffId(sId);

        const res = await axiosClient.get(`/YeuCau/${id}/detail?staffId=${sId}`);
        const data = res.data;

        // Chuyển đổi dữ liệu C# về UI State mẫu của Frontend
        setRequest({
          _id: data.id.toString(),
          status: data.trangThaiHienTai === 'HoanThanh' ? 'Completed' :
                  data.trangThaiHienTai === 'DangXuLy' ? 'OnGoing' :
                  data.trangThaiHienTai === 'DaPhanCong' ? 'Assigned' : 'Pending',
          subStatus: data.subStatus,
          description: data.moTaSuCo,
          address: data.noiSuCo,
          location: { lat: data.viDo || 16.0611, lng: data.kinhDo || 108.2272 },
          vehicle: data.bienSo ? { brand: data.hangXe, model: data.dongXe, licensePlate: data.bienSo } : null,
          service: { name: data.tenDichVu },
          customer: { name: data.tenKhachHang, phone: data.soDienThoai, email: data.email },
          chiPhiThucTe: data.chiPhiThucTe
        });
      } catch (err) {
        console.error("Lỗi tải chi tiết cứu hộ:", err);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user]);

  // 2. Hàm cập nhật Tiến trình con (Sub-status) lên C#
  const handleUpdateSubStatus = async (nextSubStatus) => {
    setUpdating(true);
    try {
      await axiosClient.put(`/YeuCau/${id}/status`, {
        idNhanVien: staffId,
        trangThai: nextSubStatus,
        ghiChu: note || `Nhân viên cập nhật: ${subStatusLabel[nextSubStatus]}`
      });
      setRequest(prev => ({ ...prev, subStatus: nextSubStatus }));
      toast.success(`Đã cập nhật tiến độ: ${subStatusLabel[nextSubStatus]}`);
      setNote('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật tiến trình thất bại');
    } finally {
      setUpdating(false);
    }
  };

  // 3. Hàm gọi API hoàn thành đơn cứu hộ và nhập số tiền thực tế
  const handleCompleteRequest = async () => {
    if (!actualCost || isNaN(actualCost) || Number(actualCost) < 0) {
      toast.error("Vui lòng nhập số tiền chi phí thực tế hợp lệ!");
      return;
    }
    setUpdating(true);
    try {
      await axiosClient.post(`/YeuCau/${id}/complete`, {
        idNhanVien: staffId,
        chiPhiThucTe: Number(actualCost),
        ghiChu: note || "Hoàn thành nhiệm vụ cứu hộ"
      });
      setRequest(prev => ({ ...prev, status: 'Completed', chiPhiThucTe: Number(actualCost) }));
      toast.success('🎉 Đã ghi nhận hóa đơn và hoàn thành nhiệm vụ!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hoàn thành đơn hàng');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading fullscreen={false} />;
  if (!request) return (
    <div className="p-8 text-center">
      <p className="text-[#64748B]">Không tìm thấy đơn cứu hộ tương ứng</p>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4" icon={ChevronLeft}>
        Quay lại
      </Button>
    </div>
  );

  const variant = statusBadgeVariant[request.status] || 'default';
  const label = statusLabel[request.status] || request.status;
  const lat = request.location?.lat;
  const lng = request.location?.lng;

  return (
    <div>
      <PageHeader
        title="Chi tiết đơn cứu hộ"
        description={`#${request._id}`}
        backButton={
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
          </button>
        }
        actions={<Badge variant={variant} size="lg" dot>{label}</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          {/* Thông tin khách hàng */}
          <Card variant="default">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <User className="w-4 h-4 text-[#1D4ED8]" />
              </div>
              <h3 className="text-[#0F172A] font-bold text-base">Thông tin khách hàng</h3>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1D4ED8] flex items-center justify-center">
                <span className="text-white font-bold text-lg">{request.customer?.name?.[0]?.toUpperCase() || 'C'}</span>
              </div>
              <div>
                <p className="text-[#0F172A] font-bold">{request.customer?.name || 'Khách hàng'}</p>
                <p className="text-[#64748B] text-sm">{request.customer?.email || '—'}</p>
              </div>
            </div>
            {request.customer?.phone && (
              <div className="flex gap-2">
                <a href={`tel:${request.customer.phone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F0FDF4] border border-[#22C55E]/20 text-[#22C55E] rounded-xl hover:bg-[#22C55E] hover:text-white transition-colors text-sm font-semibold">
                  <Phone className="w-4 h-4" /> Gọi {request.customer.phone}
                </a>
                <Link to={`/partner/chat/${id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EFF6FF] border border-[#1D4ED8]/20 text-[#1D4ED8] rounded-xl hover:bg-[#1D4ED8] hover:text-white transition-colors text-sm font-semibold">
                  <MessageSquare className="w-4 h-4" /> Nhắn tin
                </Link>
              </div>
            )}
          </Card>

          {/* Thông tin sự cố & xe */}
          <Card variant="default">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#1D4ED8]" />
              </div>
              <h3 className="text-[#0F172A] font-bold text-base">Thông tin yêu cầu</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Dịch vụ:</span>
                <span className="text-[#0F172A] font-semibold">{request.service?.name || '—'}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#64748B] flex-shrink-0">Mô tả sự cố:</span>
                <span className="text-[#0F172A] text-right leading-relaxed">{request.description || '—'}</span>
              </div>
              {request.vehicle && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Xe:</span>
                  <Badge variant="primary" size="sm">
                    {request.vehicle.brand} {request.vehicle.model} • {request.vehicle.licensePlate}
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#64748B] flex-shrink-0">Địa chỉ:</span>
                <span className="text-[#0F172A] text-right">{request.address || '—'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bản đồ định vị */}
        <Card variant="default" className="flex flex-col min-h-[500px]">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#22C55E]" />
            </div>
            <h3 className="text-[#0F172A] font-bold text-base">Vị trí GPS</h3>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-[#E2E8F0] relative z-0 mb-4 min-h-[300px]">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} />
            </MapContainer>
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#EFF6FF] border border-[#1D4ED8]/20 text-[#1D4ED8] rounded-xl hover:bg-[#1D4ED8] hover:text-white transition-colors font-semibold text-sm mt-auto">
            <Navigation className="w-4 h-4" /> Mở Google Maps để điều hướng đường đi
          </a>
        </Card>
      </div>

      {/* KHU VỰC ĐIỀU KHIỂN TIẾN ĐỘ CHO NHÂN VIÊN */}
      {request.status !== 'Completed' && (
        <Card variant="default" className="max-w-3xl">
          <h3 className="text-[#0F172A] font-bold text-base mb-3">Cập nhật tiến độ cứu hộ</h3>
          <p className="text-xs text-gray-400 mb-4">Trạng thái con hiện tại: <span className="font-bold text-blue-700">{subStatusLabel[request.subStatus] || "Chưa cập nhật tiến trình"}</span></p>
          
          <div className="mb-5">
            <Textarea label="Ghi chú cập nhật (tùy chọn)" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Nhập tình trạng xe, lý do chậm trễ hoặc thông tin hiện trường..." />
          </div>

          <div className="flex flex-col gap-6">
            {/* Các bước xử lý con */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleUpdateSubStatus('DangDen')} disabled={updating || request.subStatus === 'DangDen'} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${request.subStatus === 'DangDen' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                1. Đang đến hiện trường
              </button>
              <button onClick={() => handleUpdateSubStatus('DangSua')} disabled={updating || request.subStatus === 'DangSua'} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${request.subStatus === 'DangSua' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                2. Đang tiến hành sửa
              </button>
              <button onClick={() => handleUpdateSubStatus('DangKiemTra')} disabled={updating || request.subStatus === 'DangKiemTra'} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${request.subStatus === 'DangKiemTra' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                3. Đang kiểm nghiệm
              </button>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Form hoàn thành kèm hóa đơn */}
            <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-green-900 mb-3">Nghiệm thu & Xuất hóa đơn dịch vụ</h4>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-green-800 uppercase mb-1">Chi phí thực tế thực hiện (VNĐ) <span className="text-red-500">*</span></label>
                  <input type="number" placeholder="Ví dụ: 350000" value={actualCost} onChange={e => setActualCost(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-green-300 rounded-xl text-sm font-semibold outline-none focus:border-green-600" />
                </div>
                <Button variant="success" size="lg" loading={updating} onClick={handleCompleteRequest}>
                  Hoàn thành nhiệm vụ
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {request.status === 'Completed' && (
        <Card variant="default" className="max-w-3xl bg-[#F0FDF4] border-[#22C55E]/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[#22C55E] font-bold text-base mb-0.5">Đơn đã hoàn thành hoàn tất! 🎉</p>
              <p className="text-[#64748B] text-sm">Yêu cầu cứu hộ này đã được xử lý và ghi nhận tổng chi phí thu thực tế: <strong className="text-gray-900">{(request.chiPhiThucTe || 0).toLocaleString('vi-VN')} đ</strong></p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UpdateRequestStatus;