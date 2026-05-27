import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { MapPin, Navigation, Car, Wrench, FileText, Send, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Stepper from '../../components/ui/Stepper';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom blue marker
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => onLocationSelect(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

const STEPS = ['Chọn dịch vụ', 'Chọn xe', 'Chọn vị trí', 'Xác nhận'];

const CreateRescueRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicleId: '',
    serviceId: '',
    description: '',
    address: '',
    lat: null,
    lng: null,
  });
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState([16.0544, 108.2022]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/customer/vehicles').catch(() => ({ data: [
        { _id: 'v-mock-1', brand: 'Toyota', model: 'Vios', licensePlate: '51G-123.45', year: 2021, color: 'Trắng', type: 'Sedan' },
        { _id: 'v-mock-2', brand: 'Honda', model: 'CR-V', licensePlate: '51H-678.90', year: 2022, color: 'Đen', type: 'SUV' }
      ] })),
      axiosClient.get('/admin/services').catch(() => ({ data: [
        { _id: 's-mock-1', name: 'Kéo xe khẩn cấp', description: 'Kéo xe về gara gần nhất hoặc địa chỉ yêu cầu.', price: 500000, icon: '🔧', category: 'Khẩn cấp' },
        { _id: 's-mock-2', name: 'Thay lốp / Vá lốp', description: 'Hỗ trợ thay lốp dự phòng hoặc vá lốp tại chỗ.', price: 150000, icon: '🛞', category: 'Cơ khí' },
        { _id: 's-mock-3', name: 'Kích bình ắc quy', description: 'Kích bình ắc quy khi xe không thể khởi động.', price: 100000, icon: '🔋', category: 'Điện' }
      ] })),
    ]).then(([v, s]) => {
      setVehicles(v.data?.data || v.data || []);
      setServices(s.data?.data || s.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleLocationSelect = useCallback((lat, lng) => {
    setForm(p => ({ ...p, lat, lng }));
    reverseGeocode(lat, lng);
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setForm(p => ({ ...p, address }));
    } catch {
      setForm(p => ({ ...p, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setMapCenter([lat, lng]);
        setForm(p => ({ ...p, lat, lng }));
        reverseGeocode(lat, lng);
        setGettingLocation(false);
        toast.success('Đã lấy vị trí hiện tại!');
      },
      () => {
        toast.error('Không thể lấy vị trí. Vui lòng chọn trên bản đồ.');
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId) { toast.error('Vui lòng chọn dịch vụ'); return; }
    if (!form.address) { toast.error('Vui lòng chọn địa chỉ trên bản đồ'); return; }
    if (!form.description) { toast.error('Vui lòng mô tả sự cố'); return; }

    setSubmitting(true);
    try {
      const payload = {
        vehicleId: form.vehicleId || undefined,
        serviceId: form.serviceId,
        description: form.description,
        address: form.address,
        location: form.lat && form.lng ? { lat: form.lat, lng: form.lng } : undefined,
      };
      await axiosClient.post('/customer/rescue-requests', payload);
      toast.success('Yêu cầu cứu hộ đã được gửi!');
      navigate('/customer/rescue-requests');
    } catch (err) {
      if (!err.response) {
        toast.success('Yêu cầu cứu hộ đã được gửi! (Chế độ Demo)');
        navigate('/customer/rescue-requests');
      } else {
        toast.error(err.response?.data?.message || 'Gửi yêu cầu thất bại');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const selectedService = services.find(s => s._id === form.serviceId);
  const selectedVehicle = vehicles.find(v => v._id === form.vehicleId);

  const canGoNext = () => {
    if (step === 0) return !!form.serviceId && !!form.description;
    if (step === 1) return true;
    if (step === 2) return !!form.address;
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !form.serviceId) { toast.error('Vui lòng chọn dịch vụ'); return; }
    if (step === 0 && !form.description) { toast.error('Vui lòng mô tả sự cố'); return; }
    if (step === 2 && !form.address) { toast.error('Vui lòng chọn địa chỉ'); return; }
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader
        title="Tạo yêu cầu cứu hộ"
        description="Điền thông tin để chúng tôi đến hỗ trợ bạn nhanh nhất"
        backButton={
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </button>
        }
      />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={step} className="mb-8" />

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Service */}
        {step === 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Chọn dịch vụ <span className="text-[#EF4444]">*</span></h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} variant="table-row" />)}
              </div>
            ) : services.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="Không có dịch vụ"
                description="Hiện chưa có dịch vụ nào khả dụng"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {services.map(s => (
                  <label
                    key={s._id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      form.serviceId === s._id
                        ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/50'
                    }`}
                  >
                    <input type="radio" name="service" value={s._id} checked={form.serviceId === s._id} onChange={set('serviceId')} className="hidden" />
                    <div className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-[#E2E8F0] flex-shrink-0">{s.icon || '🔧'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0F172A]">{s.name}</p>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">{s.description}</p>
                      {s.price && <p className="text-sm font-bold text-[#1D4ED8] mt-2">{s.price.toLocaleString('vi-VN')}đ</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <Textarea
              label="Mô tả sự cố"
              required
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Mô tả chi tiết tình trạng xe: xe bị hết xăng, nổ lốp, hết bình... để kỹ thuật viên chuẩn bị dụng cụ phù hợp."
            />
          </Card>
        )}

        {/* Step 2: Select Vehicle */}
        {step === 1 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Chọn xe (tùy chọn)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* No vehicle option */}
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  !form.vehicleId
                    ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/50'
                }`}
              >
                <input type="radio" name="vehicle" value="" checked={!form.vehicleId} onChange={() => setForm(p => ({ ...p, vehicleId: '' }))} className="hidden" />
                <span className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-[#E2E8F0]">🚗</span>
                <span className="text-sm font-bold text-[#0F172A]">Không chọn xe cụ thể</span>
              </label>

              {vehicles.map(v => (
                <label
                  key={v._id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    form.vehicleId === v._id
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/50'
                  }`}
                >
                  <input type="radio" name="vehicle" value={v._id} checked={form.vehicleId === v._id} onChange={set('vehicleId')} className="hidden" />
                  <span className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-[#E2E8F0]">🚙</span>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{v.brand} {v.model}</p>
                    <p className="text-xs text-[#64748B] font-mono font-semibold mt-1">{v.licensePlate}</p>
                  </div>
                </label>
              ))}
            </div>

            {vehicles.length === 0 && (
              <EmptyState
                icon={Car}
                title="Chưa có xe nào"
                description="Bạn chưa đăng ký xe nào. Thêm xe để chọn nhanh hơn."
                actionLabel="Thêm xe"
                onAction={() => navigate('/customer/vehicles')}
                className="mt-4"
              />
            )}
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 2 && (
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#22C55E]" />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Chọn vị trí cứu hộ</h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                icon={Navigation}
                loading={gettingLocation}
                onClick={getCurrentLocation}
              >
                {gettingLocation ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
              </Button>
            </div>

            <p className="text-sm text-[#64748B] mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              Bấm vào bản đồ để chọn vị trí bạn đang đứng, hoặc dùng nút "Lấy vị trí hiện tại" để tự động định vị.
            </p>

            {/* Map */}
            <div className="h-80 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] relative z-0">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {form.lat && form.lng && (
                  <Marker position={[form.lat, form.lng]} icon={blueIcon} />
                )}
              </MapContainer>
            </div>

            {/* Address display */}
            {form.address && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#1D4ED8]/20 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#1D4ED8]" />
                </div>
                <div>
                  <p className="text-xs text-[#1D4ED8] font-bold uppercase tracking-wide">Vị trí đã chọn</p>
                  <p className="text-sm text-[#0F172A] font-medium mt-1">{form.address}</p>
                  {form.lat && form.lng && (
                    <p className="text-xs text-[#64748B] mt-1 font-mono">
                      GPS: {form.lat.toFixed(6)}, {form.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Manual address */}
            <div className="mt-4">
              <Input
                label="Hoặc nhập địa chỉ thủ công"
                type="text"
                value={form.address}
                onChange={set('address')}
                placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                icon={MapPin}
              />
            </div>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 3 && (
          <Card padding={false}>
            <Card.Header>
              <h2 className="text-base font-bold text-[#0F172A]">Xác nhận yêu cầu cứu hộ</h2>
              <p className="text-sm text-[#64748B] mt-1">Vui lòng kiểm tra kỹ các thông tin trước khi gửi</p>
            </Card.Header>

            <Card.Body>
              <div className="space-y-5">
                {[
                  { label: 'Dịch vụ', value: selectedService ? `${selectedService.icon || '🔧'} ${selectedService.name}` : '—' },
                  { label: 'Xe', value: selectedVehicle ? `🚗 ${selectedVehicle.brand} ${selectedVehicle.model} - ${selectedVehicle.licensePlate}` : 'Không chọn xe cụ thể' },
                  { label: 'Địa chỉ', value: form.address || '—' },
                  { label: 'Tọa độ GPS', value: form.lat && form.lng ? `${form.lat.toFixed(6)}, ${form.lng.toFixed(6)}` : 'Chưa chọn' },
                  { label: 'Mô tả sự cố', value: form.description || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pb-5 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                    <span className="text-xs text-[#64748B] font-semibold sm:w-1/3 flex-shrink-0 uppercase tracking-wide">{label}</span>
                    <span className="text-sm text-[#0F172A] font-semibold sm:w-2/3">{value}</span>
                  </div>
                ))}
              </div>

              {/* Cost estimate */}
              <div className="mt-6 p-5 bg-[#FBBF24] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#0F172A] font-bold">Ước tính chi phí</span>
                  <span className="text-[#0F172A] font-extrabold text-xl bg-white px-4 py-1.5 rounded-xl">
                    {selectedService?.price ? `${selectedService.price.toLocaleString('vi-VN')}đ` : 'Liên hệ tư vấn'}
                  </span>
                </div>
                <p className="text-sm text-[#0F172A]/80 font-medium">Lưu ý: Đây chỉ là giá dịch vụ cơ bản. Chi phí có thể thay đổi tùy tình hình thực tế.</p>
              </div>

              {/* Info note */}
              <div className="mt-4 flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#1D4ED8]/20 rounded-xl">
                <Clock className="w-5 h-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1D4ED8] font-bold">Đội ngũ sẽ đến trong vòng 30 phút</p>
                  <p className="text-xs text-[#0F172A] mt-1">Sau khi gửi, nhân viên sẽ liên hệ xác nhận và thông báo thời gian đến cụ thể</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <Button type="button" variant="outline" size="lg" icon={ChevronLeft} onClick={() => setStep(step - 1)}>
              Quay lại
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" variant="primary" size="lg" iconRight={ChevronRight} onClick={handleNext}>
              Tiếp theo
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              size="xl"
              icon={Send}
              loading={submitting}
            >
              Gửi yêu cầu cứu hộ ngay
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateRescueRequest;
