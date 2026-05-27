import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import { ChevronLeft, MapPin, Clock, Truck, CheckCircle, AlertCircle, User, Car, Wrench, XCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Timeline from '../../components/ui/Timeline';
import Button from '../../components/ui/Button';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusBadge = {
  Pending: { label: 'Chờ xử lý', variant: 'warning', step: 0 },
  Assigned: { label: 'Đã phân công', variant: 'primary', step: 1 },
  OnGoing: { label: 'Đang xử lý', variant: 'info', step: 2 },
  Completed: { label: 'Hoàn thành', variant: 'success', step: 3 },
  Cancelled: { label: 'Đã hủy', variant: 'danger', step: -1 },
};

const timelineSteps = [
  { title: 'Chờ xử lý', description: 'Đơn cứu hộ đã được tạo và đang chờ phân công.' },
  { title: 'Đã phân công', description: 'Đã tìm thấy nhân viên cứu hộ phù hợp.' },
  { title: 'Đang xử lý', description: 'Nhân viên đang di chuyển đến vị trí của bạn.' },
  { title: 'Hoàn thành', description: 'Sự cố đã được khắc phục thành công.' },
];

const RescueRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get(`/customer/rescue-requests/${id}`)
      .then(res => setRequest(res.data?.data || res.data))
      .catch(() => {
        // Mock data when backend is offline
        setRequest({
          _id: id,
          service: { name: 'Kéo xe khẩn cấp', price: 500000 },
          vehicle: { brand: 'Toyota', model: 'Vios', licensePlate: '51G-123.45' },
          description: 'Xe bị chết máy giữa cầu, cần kéo về gara gần nhất.',
          address: 'Cầu Rồng, Q. Hải Châu, Đà Nẵng',
          location: { lat: 16.0611, lng: 108.2272 },
          status: 'OnGoing',
          createdAt: new Date().toISOString(),
          staff: { name: 'Trần Văn Nhân', phone: '0909123456', specialization: 'Kéo xe' }
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading fullscreen={false} />;
  if (!request) return null;

  const cfg = statusBadge[request.status] || statusBadge.Pending;
  const currentStep = cfg.step;
  const lat = request.location?.lat;
  const lng = request.location?.lng;

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  return (
    <div>
      <PageHeader
        title="Chi tiết yêu cầu cứu hộ"
        description={`#${request._id}`}
        backButton={
          <Link
            to="/customer/rescue-requests"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
          </Link>
        }
        actions={
          <Badge variant={cfg.variant} size="lg" dot>
            {cfg.label}
          </Badge>
        }
      />

      {/* Progress Timeline */}
      {currentStep >= 0 && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#0F172A] mb-6">Tiến trình xử lý</h2>
              <Timeline steps={timelineSteps} currentStep={currentStep} />
            </div>
            
            {currentStep >= 1 && currentStep < 3 && (
              <div className="w-full md:w-64 shrink-0 space-y-3 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-6 md:pt-0 md:pl-8">
                <h3 className="font-bold text-[#0F172A] mb-4">Hỗ trợ khẩn cấp</h3>
                <Link to={`/customer/chat/${id}`} className="flex w-full items-center justify-center gap-2 py-3 bg-[#E0E7FF] text-[#1D4ED8] font-bold rounded-xl hover:bg-[#C7D2FE] transition-colors">
                  Nhắn tin với nhân viên
                </Link>
                <Link to={`/customer/tracking/${id}`} className="flex w-full items-center justify-center gap-2 py-3 bg-[#1D4ED8] text-white font-bold rounded-xl hover:bg-[#1E40AF] transition-colors shadow-md shadow-[#1D4ED8]/20">
                  Theo dõi vị trí (Live)
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}

      {currentStep < 0 && (
        <Card className="mb-6">
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
              <XCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#EF4444]">Yêu cầu đã bị hủy</p>
              <p className="text-xs text-[#64748B] mt-0.5">Yêu cầu này không còn được xử lý</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Column */}
        <div className="space-y-6">
          {/* Service Info */}
          <Card>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Thông tin dịch vụ</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Dịch vụ</span>
                <span className="text-[#0F172A] font-semibold">{request.service?.name || request.serviceName || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#64748B]">Mô tả sự cố</span>
                <span className="text-[#0F172A] font-medium text-right max-w-[200px] leading-relaxed">{request.description || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Ngày tạo</span>
                <span className="text-[#0F172A] font-medium">{formatDate(request.createdAt)}</span>
              </div>
              {request.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Cập nhật</span>
                  <span className="text-[#0F172A] font-medium">{formatDate(request.updatedAt)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Vehicle Info */}
          {request.vehicle && (
            <Card>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#D97706]" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Thông tin xe</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Xe</span>
                  <span className="text-[#0F172A] font-semibold">{request.vehicle.brand} {request.vehicle.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Biển số</span>
                  <Badge variant="primary" size="sm">{request.vehicle.licensePlate}</Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Staff Info */}
          {request.staff && (
            <Card>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#1D4ED8]" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Nhân viên được giao</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Tên</span>
                  <span className="text-[#0F172A] font-semibold">{request.staff.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Điện thoại</span>
                  <span className="text-[#0F172A] font-medium">{request.staff.phone || '—'}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Map Column */}
        <Card className="flex flex-col h-full min-h-[400px]">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#22C55E]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Vị trí cứu hộ</h3>
          </div>
          <p className="text-sm text-[#0F172A] font-medium mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            {request.address || 'Chưa có địa chỉ'}
          </p>
          {lat && lng ? (
            <div className="flex-1 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] relative z-0 min-h-[300px]">
              <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          ) : (
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] flex items-center justify-center min-h-[300px]">
              <div className="text-center text-[#94A3B8]">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                <p className="text-sm font-medium">Không có dữ liệu GPS</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RescueRequestDetail;
