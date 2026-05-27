import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ClipboardList, CheckCircle, Clock, Truck, AlertCircle, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const staffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const mockStaffLocation = [16.0544, 108.2022];

const mockCustomerLocations = [
  { id: 1, name: 'Nguyễn Văn A', address: 'Cầu Rồng, Đà Nẵng', lat: 16.0611, lng: 108.2272, service: 'Kéo xe' },
  { id: 2, name: 'Trần Thị B', address: 'Cầu Sông Hàn, Đà Nẵng', lat: 16.0717, lng: 108.2250, service: 'Thay lốp' },
  { id: 3, name: 'Phạm Văn C', address: 'Chợ Cồn, Đà Nẵng', lat: 16.0694, lng: 108.2144, service: 'Sạc bình' },
];

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

const StaffDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/staff/rescue-requests')
      .then(res => setRequests(res.data?.data || res.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRequests = requests.length;
  const ongoingCount = requests.filter(r => r.status === 'OnGoing').length;
  const assignedCount = requests.filter(r => r.status === 'Assigned').length;
  const completedCount = requests.filter(r => r.status === 'Completed').length;

  const recent = requests.filter(r => r.status !== 'Completed').slice(0, 5);

  const nearestCustomer = mockCustomerLocations[0];
  const polylinePositions = [
    mockStaffLocation,
    [nearestCustomer.lat, nearestCustomer.lng],
  ];

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.name || 'Nhân viên'}! 👋`}
        description="Tổng quan công việc hôm nay"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng đơn"
          value={totalRequests}
          icon={ClipboardList}
          iconBg="bg-[#EFF6FF]"
          iconColor="text-[#1D4ED8]"
          trend={12}
          trendLabel="So với tuần trước"
        />
        <StatCard
          title="Đang xử lý"
          value={ongoingCount}
          icon={AlertCircle}
          iconBg="bg-[#FFFBEB]"
          iconColor="text-[#F59E0B]"
        />
        <StatCard
          title="Chờ xử lý"
          value={assignedCount}
          icon={Clock}
          iconBg="bg-[#EFF6FF]"
          iconColor="text-[#1D4ED8]"
        />
        <StatCard
          title="Hoàn thành"
          value={completedCount}
          icon={CheckCircle}
          iconBg="bg-[#F0FDF4]"
          iconColor="text-[#22C55E]"
          trend={8}
          trendLabel="Hoàn thành tốt"
        />
      </div>

      {/* Map Section */}
      <Card variant="default" padding={false} className="mb-8 overflow-hidden">
        <Card.Header>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <Navigation className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Bản đồ điều phối</h2>
              <p className="text-xs text-[#64748B]">Vị trí của bạn và các yêu cầu đang chờ</p>
            </div>
          </div>
        </Card.Header>
        <div className="h-[400px] relative z-0">
          <MapContainer
            center={mockStaffLocation}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Staff marker */}
            <Marker position={mockStaffLocation} icon={staffIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-[#0F172A]">📍 Vị trí của bạn</p>
                  <p className="text-xs text-[#64748B]">{user?.name || 'Nhân viên'}</p>
                </div>
              </Popup>
            </Marker>
            {/* Customer markers */}
            {mockCustomerLocations.map(c => (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={customerIcon}>
                <Popup>
                  <div>
                    <p className="font-bold text-[#0F172A]">{c.name}</p>
                    <p className="text-xs text-[#64748B]">{c.service}</p>
                    <p className="text-xs text-[#64748B]">{c.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Polyline to nearest customer */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{ color: '#1D4ED8', weight: 3, dashArray: '10, 10' }}
            />
          </MapContainer>
        </div>
        <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" /> Vị trí của bạn
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" /> Khách hàng chờ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0 border-t-2 border-dashed border-[#1D4ED8]" /> Tuyến đường gần nhất
            </span>
          </div>
        </div>
      </Card>

      {/* Pending Requests */}
      {loading ? <Loading fullscreen={false} /> : (
        <Card variant="default" padding={false}>
          <Card.Header>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Đơn đang chờ xử lý</h2>
              {recent.length > 0 && (
                <Badge variant="warning" size="sm">{recent.length}</Badge>
              )}
            </div>
          </Card.Header>
          {recent.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="Tuyệt vời!"
              description="Không có đơn nào đang chờ xử lý"
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recent.map(req => {
                const variant = statusBadgeVariant[req.status] || 'default';
                const label = statusLabel[req.status] || req.status;
                return (
                  <div key={req._id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg">🚗</div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{req.service?.name || 'Cứu hộ xe'}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {req.customer?.name || 'Khách hàng'} • {req.address || 'Chưa có địa chỉ'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={variant} size="sm" dot>{label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default StaffDashboard;
