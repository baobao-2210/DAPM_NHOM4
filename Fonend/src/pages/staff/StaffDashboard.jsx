import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ClipboardList, CheckCircle, Clock, AlertCircle, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sửa lỗi icon của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const staffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const mockStaffLocation = [16.0544, 108.2022]; // Tạm dùng tọa độ Đà Nẵng làm gốc

const StaffDashboard = () => {
  const { user } = useAuth();
  
  // States lưu dữ liệu từ C#
  const [staffId, setStaffId] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [stats, setStats] = useState(null);
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

  // 2. Có staffId thì gọi các API Yêu cầu & Thống kê
  useEffect(() => {
    if (!staffId) return;

    const fetchData = async () => {
      try {
        const now = new Date();
        const [pendingRes, activeRes, historyRes] = await Promise.all([
          axiosClient.get(`/YeuCau/pending?staffId=${staffId}`),
          axiosClient.get(`/YeuCau/active-task/${staffId}`),
          axiosClient.get(`/NhanVien/${staffId}/history?thang=${now.getMonth() + 1}&nam=${now.getFullYear()}`)
        ]);

        setPendingRequests(pendingRes.data || []);
        setActiveTask(activeRes.data || null);
        setStats(historyRes.data?.thongKe || null);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId]);

  if (loading) return <Loading fullscreen={false} />;

  // Tính toán dữ liệu hiển thị bản đồ
  const customerLocations = pendingRequests.map(r => ({
    id: r.id, name: r.tenKhachHang, address: r.noiSuCo, service: r.tenDichVu,
    lat: r.viDo || 16.0611 + (Math.random() * 0.02 - 0.01), // Dùng random nếu DB chưa nhập GPS
    lng: r.kinhDo || 108.2272 + (Math.random() * 0.02 - 0.01)
  }));

  // Ưu tiên hiển thị đường đi tới khách hàng đang xử lý (nếu có)
  let polylinePositions = [];
  if (activeTask) {
    const activeLat = activeTask.viDo || 16.0611;
    const activeLng = activeTask.kinhDo || 108.2272;
    polylinePositions = [mockStaffLocation, [activeLat, activeLng]];
    customerLocations.push({
      id: activeTask.id, name: activeTask.tenKhachHang, address: activeTask.noiSuCo, 
      service: activeTask.tenDichVu, lat: activeLat, lng: activeLng, isActive: true
    });
  } else if (customerLocations.length > 0) {
    polylinePositions = [mockStaffLocation, [customerLocations[0].lat, customerLocations[0].lng]];
  }

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.name || 'Nhân viên'}! 👋`}
        description="Tổng quan công việc hôm nay"
      />

      {/* STATS BÓC TỪ DATABASE C# */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng đơn tháng"
          value={stats?.tongDon || 0}
          icon={ClipboardList} iconBg="bg-[#EFF6FF]" iconColor="text-[#1D4ED8]"
        />
        <StatCard
          title="Đơn đang xử lý"
          value={activeTask ? 1 : 0}
          icon={AlertCircle} iconBg="bg-[#FFFBEB]" iconColor="text-[#F59E0B]"
        />
        <StatCard
          title="Đơn chờ nhận"
          value={pendingRequests.length}
          icon={Clock} iconBg="bg-[#EFF6FF]" iconColor="text-[#1D4ED8]"
        />
        <StatCard
          title="Đã hoàn thành"
          value={stats?.donHoanThanh || 0}
          icon={CheckCircle} iconBg="bg-[#F0FDF4]" iconColor="text-[#22C55E]"
        />
      </div>

      {/* BẢN ĐỒ */}
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
          <MapContainer center={mockStaffLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={mockStaffLocation} icon={staffIcon}>
              <Popup><p className="font-bold">📍 Vị trí của bạn</p></Popup>
            </Marker>
            
            {customerLocations.map(c => (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={customerIcon}>
                <Popup>
                  <div>
                    <p className="font-bold text-[#0F172A]">{c.name} {c.isActive && "(Đang xử lý)"}</p>
                    <p className="text-xs text-[#64748B]">{c.service}</p>
                    <p className="text-xs text-[#64748B]">{c.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {polylinePositions.length > 0 && (
              <Polyline positions={polylinePositions} pathOptions={{ color: '#1D4ED8', weight: 3, dashArray: '10, 10' }} />
            )}
          </MapContainer>
        </div>
      </Card>

      {/* DANH SÁCH ĐƠN CHỜ NHẬN */}
      <Card variant="default" padding={false}>
        <Card.Header>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">Đơn chờ tiếp nhận</h2>
            {pendingRequests.length > 0 && <Badge variant="warning" size="sm">{pendingRequests.length}</Badge>}
          </div>
        </Card.Header>
        
        {pendingRequests.length === 0 ? (
          <EmptyState icon={CheckCircle} title="Tuyệt vời!" description="Không có đơn nào đang chờ xử lý" />
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg">🚗</div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{req.tenDichVu}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.tenKhachHang} • {req.noiSuCo}
                    </p>
                  </div>
                </div>
                <Badge variant="warning" size="sm" dot>Chờ nhận</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StaffDashboard;