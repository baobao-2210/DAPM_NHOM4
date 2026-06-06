import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';
import { MapPin, Navigation, Car, Wrench, FileText, Send, ChevronLeft, ChevronRight, Clock, Image as ImageIcon, X } from 'lucide-react';
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

const STEPS = ['Chọn dịch vụ', 'Chọn xe', 'Chọn vị trí', 'Mô tả & Ảnh', 'Xác nhận'];

const CreateRescueRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicleId: '',
    serviceId: '',
    description: '',
    imageUrl: '',
    address: '',
    lat: null,
    lng: null,
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [mapCenter, setMapCenter] = useState([16.0544, 108.2022]); // Default Da Nang
  const [gettingLocation, setGettingLocation] = useState(false);
  const [step, setStep] = useState(0);
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    Promise.all([
      customerApi.getVehicles().catch(() => ({ data: [] })),
      customerApi.getServices ? customerApi.getServices().catch(() => ({ data: [] })) : axiosClient.get('/DichVu').catch(() => ({ data: [] })),
    ]).then(([v, s]) => {
      setVehicles(v.data?.data || v.data || []);
      setServices(s.data?.data || s.data || []);
      
      // Auto-select if only 1 vehicle
      const loadedVehicles = v.data?.data || v.data || [];
      if (loadedVehicles.length === 1) {
        setForm(p => ({ ...p, vehicleId: loadedVehicles[0]._id }));
      }
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      if (customerApi.uploadImage) {
        const res = await customerApi.uploadImage(file);
        setForm(p => ({ ...p, imageUrl: res.data.Url || res.data.url }));
        toast.success('Tải ảnh lên thành công');
      } else {
        toast.success('Đã đính kèm ảnh (Chưa có API upload)');
      }
    } catch (err) {
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm(p => ({ ...p, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        vehicleId: form.vehicleId,
        serviceId: form.serviceId,
        description: form.description,
        Location: (form.lat && form.lng) ? `${form.address} | ${form.lat},${form.lng}` : form.address,
        ImageUrl: form.imageUrl
      };
      await customerApi.createRequest(payload);
      toast.success('Yêu cầu cứu hộ đã được gửi!');
      navigate('/customer/active-requests');
    } catch (err) {
      if (!err.response) {
        // Fallback for demo
        toast.success('Yêu cầu cứu hộ đã được gửi! (Chế độ Demo)');
        navigate('/customer/active-requests');
      } else {
        toast.error(err.response?.data?.message || 'Gửi yêu cầu thất bại');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const selectedService = services.find(s => String(s._id) === String(form.serviceId) || String(s.idDichVu) === String(form.serviceId));
  const selectedVehicle = vehicles.find(v => String(v._id) === String(form.vehicleId));

  const handleNext = () => {
    if (step === 0 && !form.serviceId) { toast.error('Vui lòng chọn dịch vụ'); return; }
    if (step === 1 && !form.vehicleId) { toast.error('Vui lòng chọn xe'); return; }
    if (step === 2 && !form.address) { toast.error('Vui lòng chọn địa chỉ'); return; }
    if (step === 3 && !form.description) { toast.error('Vui lòng mô tả sự cố'); return; }
    if (step < 4) setStep(step + 1);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(s => {
                  const sId = s._id || s.idDichVu;
                  const sName = s.name || s.tenDichVu;
                  return (
                    <div
                      key={sId}
                      onClick={() => {
                        setForm(p => ({ ...p, serviceId: sId }));
                        handleNext();
                      }}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        String(form.serviceId) === String(sId)
                          ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/50'
                      }`}
                    >
                      <div className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-[#E2E8F0] flex-shrink-0">{s.icon || '🔧'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0F172A]">{sName}</p>
                        {s.description && <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">{s.description}</p>}
                        {s.price && <p className="text-sm font-bold text-[#1D4ED8] mt-2">{s.price.toLocaleString('vi-VN')}đ</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Select Vehicle */}
        {step === 1 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Chọn xe <span className="text-[#EF4444]">*</span></h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map(v => (
                <div
                  key={v._id}
                  onClick={() => {
                    setForm(p => ({ ...p, vehicleId: v._id }));
                    handleNext();
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    String(form.vehicleId) === String(v._id)
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/50'
                  }`}
                >
                  <span className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-[#E2E8F0]">🚙</span>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{v.brand} {v.model}</p>
                    <p className="text-xs text-[#64748B] font-mono font-semibold mt-1">{v.licensePlate}</p>
                  </div>
                </div>
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
                <h2 className="text-base font-bold text-[#0F172A]">Chọn vị trí sự cố <span className="text-[#EF4444]">*</span></h2>
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
                <div className="flex-1">
                  <p className="text-xs text-[#1D4ED8] font-bold uppercase tracking-wide">Vị trí đã chọn</p>
                  <p className="text-sm text-[#0F172A] font-medium mt-1">{form.address}</p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Step 4: Description and Image */}
        {step === 3 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#D97706]" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Mô tả sự cố <span className="text-[#EF4444]">*</span></h2>
            </div>

            <Textarea
              label="Chi tiết sự cố"
              required
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="VD: Xe đang chạy thì xịt lốp trái phía trước, không có lốp dự phòng..."
            />

            <div className="mt-6">
              <label className="block text-sm font-bold text-[#0F172A] mb-2">Ảnh hiện trường (Tùy chọn)</label>
              <p className="text-xs text-[#64748B] mb-3">Hình ảnh giúp kỹ thuật viên nắm rõ tình hình hơn để chuẩn bị dụng cụ phù hợp.</p>
              
              {!imagePreview ? (
                <label className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8FAFC] hover:border-[#1D4ED8] transition-colors group">
                  <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-[#1D4ED8]" />
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A]">Nhấn để tải ảnh lên</span>
                  <span className="text-xs text-[#64748B] mt-1">Hỗ trợ JPG, PNG (Tối đa 5MB)</span>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative inline-block border border-[#E2E8F0] rounded-2xl overflow-hidden p-2">
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-48 rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="w-6 h-6 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {step === 4 && (
          <Card padding={false}>
            <Card.Header>
              <h2 className="text-base font-bold text-[#0F172A]">Xác nhận yêu cầu cứu hộ</h2>
              <p className="text-sm text-[#64748B] mt-1">Vui lòng kiểm tra kỹ các thông tin trước khi gửi</p>
            </Card.Header>

            <Card.Body>
              <div className="space-y-5">
                {[
                  { label: 'Dịch vụ', value: selectedService ? `${selectedService.icon || '🔧'} ${selectedService.name || selectedService.tenDichVu}` : '—' },
                  { label: 'Xe', value: selectedVehicle ? `🚗 ${selectedVehicle.brand} ${selectedVehicle.model} - ${selectedVehicle.licensePlate}` : 'Chưa chọn' },
                  { label: 'Địa chỉ', value: form.address || '—' },
                  { label: 'Mô tả sự cố', value: form.description || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pb-5 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                    <span className="text-xs text-[#64748B] font-semibold sm:w-1/3 flex-shrink-0 uppercase tracking-wide">{label}</span>
                    <span className="text-sm text-[#0F172A] font-semibold sm:w-2/3">{value}</span>
                  </div>
                ))}

                {imagePreview && (
                   <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pt-2">
                     <span className="text-xs text-[#64748B] font-semibold sm:w-1/3 flex-shrink-0 uppercase tracking-wide">Ảnh đính kèm</span>
                     <img src={imagePreview} alt="Sự cố" className="h-24 w-auto rounded-lg object-cover border border-[#E2E8F0]" />
                   </div>
                )}
              </div>

              {/* Info note */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#1D4ED8]/20 rounded-xl">
                <Clock className="w-5 h-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1D4ED8] font-bold">Hỗ trợ trong tích tắc</p>
                  <p className="text-xs text-[#0F172A] mt-1">Sau khi gửi yêu cầu, hệ thống sẽ tự động ghép nối với nhân viên cứu hộ gần nhất.</p>
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

          {step < 4 ? (
            <Button type="button" variant="primary" size="lg" iconRight={ChevronRight} onClick={handleNext}>
              Tiếp theo
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              size="xl"
              icon={Send}
              loading={submitting || uploading}
              disabled={uploading}
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
