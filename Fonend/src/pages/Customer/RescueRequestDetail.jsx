import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { customerApi } from '../../api/customerApi';
import Loading from '../../components/Loading';
import { ChevronLeft, MapPin, Clock, Truck, CheckCircle, AlertCircle, User, Car, Wrench, XCircle, DollarSign, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Timeline from '../../components/ui/Timeline';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Map backend raw status to UI config
const statusBadge = {
  'TiepNhan': { label: 'Chờ tiếp nhận', variant: 'warning', step: 0 },
  'DangXuLy': { label: 'Đang xử lý', variant: 'info', step: 1 }, // Fallback if no subStatus
  'DaNhan': { label: 'Đã nhận đơn', variant: 'primary', step: 1 },
  'DangDen': { label: 'Đang di chuyển', variant: 'info', step: 2 },
  'DaDen': { label: 'Đã đến nơi', variant: 'info', step: 3 },
  'DangSua': { label: 'Đang sửa chữa', variant: 'info', step: 4 },
  'HoanThanh': { label: 'Hoàn thành', variant: 'success', step: 5 },
  'DaHuy': { label: 'Đã hủy', variant: 'danger', step: -1 },
};

const timelineSteps = [
  { title: 'Chờ tiếp nhận', description: 'Đơn của bạn đang chờ điều phối.' },
  { title: 'Đã nhận đơn', description: 'Nhân viên đã tiếp nhận yêu cầu.' },
  { title: 'Đang di chuyển', description: 'Nhân viên đang trên đường đến.' },
  { title: 'Đã đến nơi', description: 'Nhân viên đã đến vị trí sự cố.' },
  { title: 'Đang sửa chữa', description: 'Đang tiến hành khắc phục.' },
  { title: 'Hoàn thành', description: 'Sự cố đã được khắc phục.' },
];

const RescueRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = () => {
      customerApi.getRequestDetail(id)
        .then(res => setRequest(res.data?.data || res.data))
        .catch((err) => {
          if (!request) {
            toast.error('Không thể tải chi tiết yêu cầu');
            navigate('/customer/active-requests');
          }
        })
        .finally(() => setLoading(false));
    };

    fetchDetail();
    
    // Polling every 5 seconds if not completed/cancelled
    const intervalId = setInterval(() => {
      if (request && request.status !== 'HoanThanh' && request.status !== 'DaHuy') {
        fetchDetail();
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [id, request?.status]);

  if (loading && !request) return <Loading fullscreen={false} />;
  if (!request) return null;

  // Determine exact status
  let displayStatus = request.status;
  if (request.status === 'DangXuLy' && request.subStatus) {
    displayStatus = request.subStatus;
  }
  
  const cfg = statusBadge[displayStatus] || statusBadge.TiepNhan;
  const currentStep = cfg.step;
  
  // Try to parse lat lng from location string if it's formatted like that, otherwise rely on DB if it has coords
  let lat = null, lng = null;
  if (request.location && typeof request.location === 'string') {
    if (request.location.includes('|')) {
      const coordsStr = request.location.split('|')[1];
      const coords = coordsStr.split(',');
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        lat = parseFloat(coords[0].trim());
        lng = parseFloat(coords[1].trim());
      }
    } else {
      const parts = request.location.split(',');
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        lat = parseFloat(parts[0].trim());
        lng = parseFloat(parts[1].trim());
      }
    }
  }
  // If backend returns location object with lat/lng
  if (request.location?.lat) {
    lat = request.location.lat;
    lng = request.location.lng;
  }

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  return (
    <div>
      <PageHeader
        title="Chi tiết yêu cầu cứu hộ"
        description={`#${request._id}`}
        backButton={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </button>
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
            
            {currentStep >= 1 && currentStep < 5 && (
              <div className="w-full md:w-64 shrink-0 space-y-3 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-6 md:pt-0 md:pl-8">
                <h3 className="font-bold text-[#0F172A] mb-4">Liên hệ hỗ trợ</h3>
                <Link to={`/customer/chat/${id}`} className="flex w-full items-center justify-center gap-2 py-3 bg-[#E0E7FF] text-[#1D4ED8] font-bold rounded-xl hover:bg-[#C7D2FE] transition-colors">
                  Nhắn tin với nhân viên
                </Link>
                {currentStep >= 1 && currentStep <= 3 && (
                  <Link to={`/customer/tracking/${id}`} className="flex w-full items-center justify-center gap-2 py-3 bg-[#1D4ED8] text-white font-bold rounded-xl hover:bg-[#1E40AF] transition-colors shadow-md shadow-[#1D4ED8]/20">
                    Theo dõi vị trí (Live)
                  </Link>
                )}
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
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-[#1D4ED8]" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Chi tiết dịch vụ</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B] mb-0.5 font-semibold uppercase tracking-wide">Chi phí</p>
                <p className="text-lg font-bold text-[#0F172A]">{request.total ? request.total.toLocaleString('vi-VN') + 'đ' : 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-[#64748B]">Dịch vụ</span>
                <span className="text-[#0F172A] font-semibold text-right">{request.service || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#64748B]">Mô tả sự cố</span>
                <span className="text-[#0F172A] font-medium text-right max-w-[200px] sm:max-w-[300px] leading-relaxed">{request.description || '—'}</span>
              </div>
              {request.imageUrl && (
                <div className="flex justify-between items-start">
                  <span className="text-[#64748B]">Ảnh đính kèm</span>
                  <a href={request.imageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#1D4ED8] hover:underline font-semibold bg-[#EFF6FF] px-3 py-1.5 rounded-lg">
                    <ImageIcon className="w-4 h-4" /> Xem ảnh
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#64748B]">Ngày tạo</span>
                <span className="text-[#0F172A] font-medium">{formatDate(request.date)}</span>
              </div>
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
                  <span className="text-[#0F172A] font-semibold">{request.vehicle}</span>
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
                <h3 className="text-base font-bold text-[#0F172A]">Nhân viên phụ trách</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Họ tên</span>
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

        {/* Map / Address Column */}
        <Card className="flex flex-col h-full min-h-[300px]">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#22C55E]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Vị trí sự cố</h3>
          </div>
          <div className="p-4 bg-[#EFF6FF] border border-[#1D4ED8]/20 rounded-2xl mb-4">
            <p className="text-sm text-[#0F172A] font-medium leading-relaxed">
              {request.location ? request.location.split('|')[0].trim() : 'Chưa có địa chỉ'}
            </p>
          </div>
          
          {lat && lng ? (
            <div className="flex-1 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] relative z-0 min-h-[250px]">
              <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          ) : (
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] flex items-center justify-center min-h-[250px]">
              <div className="text-center text-[#94A3B8]">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                <p className="text-sm font-medium">Không có tọa độ GPS để hiển thị bản đồ</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RescueRequestDetail;
