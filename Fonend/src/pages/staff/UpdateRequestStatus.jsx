import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { ChevronLeft, MapPin, Clock, Truck, CheckCircle, AlertCircle, ArrowRight, Phone, User, Wrench, Navigation, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusFlow = {
  Assigned: { next: 'OnGoing', label: 'Bắt đầu xử lý', icon: AlertCircle },
  OnGoing: { next: 'Completed', label: 'Hoàn thành', icon: CheckCircle },
};

const statusBadgeVariant = {
  Pending: 'warning',
  Assigned: 'primary',
  OnGoing: 'info',
  Completed: 'success',
};

const statusLabel = {
  Pending: 'Chờ xử lý',
  Assigned: 'Đã phân công',
  OnGoing: 'Đang xử lý',
  Completed: 'Hoàn thành',
};

const UpdateRequestStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    axiosClient.get(`/staff/rescue-requests`)
      .then(res => {
        const list = res.data?.data || res.data || [];
        const found = list.find(r => r._id === id);
        setRequest(found || null);
      })
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    const nextStatus = statusFlow[request.status]?.next;
    if (!nextStatus) return;
    setUpdating(true);
    try {
      const res = await axiosClient.put(`/staff/rescue-requests/${id}/status`, { status: nextStatus, note });
      setRequest(prev => ({ ...prev, status: nextStatus, ...res.data?.data }));
      toast.success(`Đã cập nhật trạng thái: ${statusLabel[nextStatus]}`);
      setNote('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading fullscreen={false} />;
  if (!request) return (
    <div className="p-8 text-center">
      <p className="text-[#64748B]">Không tìm thấy đơn cứu hộ</p>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4" icon={ChevronLeft}>
        Quay lại
      </Button>
    </div>
  );

  const variant = statusBadgeVariant[request.status] || 'default';
  const label = statusLabel[request.status] || request.status;
  const nextStep = statusFlow[request.status];
  const lat = request.location?.lat;
  const lng = request.location?.lng;

  return (
    <div>
      <PageHeader
        title="Chi tiết đơn cứu hộ"
        description={`#${request._id}`}
        backButton={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
          </button>
        }
        actions={
          <Badge variant={variant} size="lg" dot>{label}</Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer & Request Info */}
        <div className="space-y-6">
          {/* Customer */}
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
                <a
                  href={`tel:${request.customer.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F0FDF4] border border-[#22C55E]/20 text-[#22C55E] rounded-xl hover:bg-[#22C55E] hover:text-white transition-colors text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" /> Gọi {request.customer.phone}
                </a>
                <Link
                  to={`/staff/chat/${id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EFF6FF] border border-[#1D4ED8]/20 text-[#1D4ED8] rounded-xl hover:bg-[#1D4ED8] hover:text-white transition-colors text-sm font-semibold"
                >
                  <MessageSquare className="w-4 h-4" /> Nhắn tin
                </Link>
              </div>
            )}
          </Card>

          {/* Service info */}
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

        {/* Map */}
        <Card variant="default" className="flex flex-col min-h-[500px]">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#22C55E]" />
            </div>
            <h3 className="text-[#0F172A] font-bold text-base">Vị trí GPS</h3>
          </div>
          {lat && lng ? (
            <div className="flex-1 rounded-xl overflow-hidden border border-[#E2E8F0] relative z-0 mb-4 min-h-[300px]">
              <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          ) : (
            <div className="flex-1 rounded-xl bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] flex items-center justify-center mb-4 min-h-[300px]">
              <div className="text-center text-[#94A3B8]">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                <p className="text-sm font-medium">Không có dữ liệu GPS</p>
              </div>
            </div>
          )}
          {lat && lng && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#EFF6FF] border border-[#1D4ED8]/20 text-[#1D4ED8] rounded-xl hover:bg-[#1D4ED8] hover:text-white transition-colors font-semibold text-sm mt-auto"
            >
              <Navigation className="w-4 h-4" /> Mở Google Maps để điều hướng
            </a>
          )}
        </Card>
      </div>

      {/* Update Status */}
      {nextStep && (
        <Card variant="default" className="max-w-3xl">
          <h3 className="text-[#0F172A] font-bold text-base mb-5">Cập nhật trạng thái</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <Badge variant={variant} size="lg" dot>{label}</Badge>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] hidden sm:block" />
            <ArrowRight className="w-4 h-4 text-[#94A3B8] rotate-90 sm:hidden ml-6" />
            <Badge variant={statusBadgeVariant[nextStep.next]} size="lg" dot>
              {statusLabel[nextStep.next]}
            </Badge>
          </div>
          <div className="mb-5">
            <Textarea
              label="Ghi chú (tùy chọn)"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú về tình trạng xe, tiến độ xử lý..."
            />
          </div>
          <Button
            variant={nextStep.next === 'Completed' ? 'success' : 'primary'}
            size="lg"
            icon={nextStep.icon}
            loading={updating}
            onClick={handleUpdateStatus}
          >
            {nextStep.label}
          </Button>
        </Card>
      )}

      {request.status === 'Completed' && (
        <Card variant="default" className="max-w-3xl bg-[#F0FDF4] border-[#22C55E]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[#22C55E] font-bold text-base mb-0.5">Đơn đã hoàn thành!</p>
              <p className="text-[#64748B] text-sm">Yêu cầu cứu hộ này đã được xử lý thành công</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UpdateRequestStatus;
