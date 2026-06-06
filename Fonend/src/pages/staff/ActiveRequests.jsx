import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { MapPin, Phone, Car, Wrench, FileText, Navigation, CheckCircle, MessageSquare } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Icons for Map
const staffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

import { useMap } from 'react-leaflet';
const MapBounds = ({ customerPos, staffPos }) => {
  const map = useMap();
  useEffect(() => {
    if (customerPos && staffPos) {
      const bounds = L.latLngBounds([customerPos, staffPos]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, customerPos, staffPos]);
  return null;
};

const STEPS = [
  { id: 'DaNhan', label: 'Đã nhận đơn' },
  { id: 'DangDen', label: 'Đang di chuyển' },
  { id: 'DaDen', label: 'Đã đến nơi' },
  { id: 'DangSua', label: 'Đang sửa chữa' },
  { id: 'HoanThanh', label: 'Hoàn thành' }
];

const ActiveRequests = () => {
  const { user } = useAuth();
  const [staffId, setStaffId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [chiPhi, setChiPhi] = useState('');

  const [customerPos, setCustomerPos] = useState([16.0611, 108.2272]);
  const [staffPos, setStaffPos] = useState([10.75, 106.65]); // Default HCMC

  useEffect(() => {
    const idTaiKhoan = user?._id || user?.id;
    if (idTaiKhoan) {
      axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`)
        .then(res => setStaffId(res.data.idNhanVien))
        .catch(err => console.error(err));
    }
  }, [user]);

  const loadActiveTask = async (hideLoading = false) => {
    if (!staffId) return;
    if (!hideLoading) setLoading(true);
    try {
      const res = await axiosClient.get(`/YeuCau/active-task/${staffId}`);
      setActiveTask(res.data);
      
      // Update customer position if task exists
      if (res.data && res.data.noiSuCo) {
        let newLat = customerPos[0], newLng = customerPos[1];
        let parsed = false;
        if (res.data.noiSuCo.includes('|')) {
          const coordsStr = res.data.noiSuCo.split('|')[1];
          const coords = coordsStr.split(',');
          if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            newLat = parseFloat(coords[0].trim());
            newLng = parseFloat(coords[1].trim());
            parsed = true;
          }
        }
        if (parsed) {
          setCustomerPos([newLat, newLng]);
          setStaffPos(prev => prev[0] === 10.75 ? [newLat - 0.015, newLng - 0.015] : prev);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!hideLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveTask();
    
    const interval = setInterval(() => {
      loadActiveTask(true);
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  // Simulate staff moving
  useEffect(() => {
    if (!activeTask) return;
    
    // Stop moving if arrived or completed
    if (['DaDen', 'DangSua', 'HoanThanh', 'DaHuy'].includes(activeTask.subStatus)) {
      setStaffPos(customerPos);
      return;
    }

    const interval = setInterval(() => {
      setStaffPos(prev => {
        const newLat = prev[0] + (customerPos[0] - prev[0]) * 0.1;
        const newLng = prev[1] + (customerPos[1] - prev[1]) * 0.1;
        return [newLat, newLng];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTask, customerPos]);

  const handleUpdateStatus = async (nextStatus) => {
    if (!activeTask) return;
    setUpdating(true);
    try {
      if (nextStatus === 'HoanThanh') {
        if (!chiPhi || isNaN(chiPhi) || Number(chiPhi) < 0) {
          toast.error("Vui lòng nhập chi phí thực tế hợp lệ!");
          setUpdating(false);
          return;
        }
        await axiosClient.post(`/YeuCau/${activeTask.id}/complete`, {
          idNhanVien: staffId,
          chiPhiThucTe: Number(chiPhi),
          ghiChu: "Đã hoàn thành"
        });
        toast.success("Đơn đã hoàn thành!");
        setActiveTask(null); // Clear active task since it's done
      } else {
        await axiosClient.put(`/YeuCau/${activeTask.id}/status`, {
          idNhanVien: staffId,
          trangThai: nextStatus,
          ghiChu: `Chuyển trạng thái sang: ${STEPS.find(s => s.id === nextStatus)?.label}`
        });
        toast.success("Cập nhật trạng thái thành công!");
        loadActiveTask();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading fullscreen={false} />;

  if (!activeTask) {
    return (
      <div className="font-['Inter']">
        <PageHeader title="Đơn đang xử lý" description="Bạn hiện không có đơn nào đang thực hiện." />
        <EmptyState icon={CheckCircle} title="Thảnh thơi!" description="Hãy chuyển sang tab Đơn mới để nhận yêu cầu cứu hộ." />
      </div>
    );
  }

  const foundIndex = activeTask.subStatus ? STEPS.findIndex(s => s.id === activeTask.subStatus) : 0;
  const currentStepIndex = foundIndex >= 0 ? foundIndex : 0; // Default to 0 if not found

  const nextStep = currentStepIndex < STEPS.length - 1 ? STEPS[currentStepIndex + 1] : null;

  let lat = 16.0611, lng = 108.2272;
  if (activeTask.noiSuCo && activeTask.noiSuCo.includes('|')) {
    const coordsStr = activeTask.noiSuCo.split('|')[1];
    const coords = coordsStr.split(',');
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      lat = parseFloat(coords[0].trim());
      lng = parseFloat(coords[1].trim());
    }
  }

  return (
    <div className="font-['Inter']">
      <PageHeader
        title="Đơn đang xử lý"
        description={`Mã đơn: #${activeTask.id} - ${activeTask.tenDichVu}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flow & Action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <Card className="border border-slate-200 shadow-sm rounded-[16px]">
            <Card.Header className="bg-slate-50 border-b border-slate-100 py-4">
              <h3 className="font-bold text-slate-800">Tiến trình cứu hộ</h3>
            </Card.Header>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0 rounded-full"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 z-0 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>
                
                {STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isActive = index === currentStepIndex;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                        isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 
                        isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-xs font-semibold absolute top-10 whitespace-nowrap ${isActive ? 'text-blue-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action */}
              <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Trạng thái hiện tại:</p>
                  <p className="text-lg font-black text-slate-800">{STEPS[currentStepIndex].label}</p>
                </div>
                
                {nextStep && nextStep.id !== 'HoanThanh' && (
                  <button 
                    onClick={() => handleUpdateStatus(nextStep.id)}
                    disabled={updating}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Chuyển sang: {nextStep.label}
                  </button>
                )}

                {nextStep && nextStep.id === 'HoanThanh' && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input 
                      type="number" 
                      placeholder="Chi phí thực tế (VNĐ)" 
                      value={chiPhi} 
                      onChange={e => setChiPhi(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-green-500 text-sm font-semibold w-full sm:w-48"
                    />
                    <button 
                      onClick={() => handleUpdateStatus('HoanThanh')}
                      disabled={updating}
                      className="w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center"
                    >
                      Hoàn thành đơn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Bản đồ */}
          <Card className="border border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
            <Card.Header className="bg-slate-50 border-b border-slate-100 py-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" /> Vị trí sự cố
              </h3>
            </Card.Header>
            <div className="h-[300px] w-full relative z-0">
              <MapContainer 
                center={customerPos} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={customerPos} icon={customerIcon}>
                  <Popup>{activeTask.noiSuCo ? activeTask.noiSuCo.split('|')[0].trim() : 'Vị trí sự cố'}</Popup>
                </Marker>
                <Marker position={staffPos} icon={staffIcon}>
                  <Popup>Vị trí của bạn (Nhân viên)</Popup>
                </Marker>
                <Polyline 
                  positions={[customerPos, staffPos]} 
                  color="#1D4ED8" 
                  weight={4} 
                  dashArray="10, 10" 
                  opacity={0.6}
                />
                <MapBounds customerPos={customerPos} staffPos={staffPos} />
              </MapContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm rounded-[16px]">
            <Card.Header className="bg-slate-50 border-b border-slate-100 py-4">
              <h3 className="font-bold text-slate-800">Thông tin chi tiết</h3>
            </Card.Header>
            <div className="p-5 space-y-5 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black">
                  {(activeTask.tenKhachHang || 'K').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{activeTask.tenKhachHang || 'Khách hàng'}</p>
                  <a href={`tel:${activeTask.soDienThoai}`} className="text-blue-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {activeTask.soDienThoai || 'Chưa có số ĐT'}
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div>
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Wrench className="w-4 h-4"/> Dịch vụ:</span>
                  <p className="font-bold text-slate-800">{activeTask.tenDichVu}</p>
                </div>
                <div>
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><Car className="w-4 h-4"/> Phương tiện:</span>
                  <p className="font-bold text-slate-800">{activeTask.hangXe} {activeTask.dongXe} <Badge variant="default" size="sm">{activeTask.bienSo}</Badge></p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1 mb-1"><MapPin className="w-4 h-4"/> Địa chỉ:</span>
                <p className="font-semibold text-slate-800">{activeTask.noiSuCo ? activeTask.noiSuCo.split('|')[0].trim() : '—'}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Liên hệ khách hàng</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${activeTask.soDienThoai}`} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Phone className="w-4 h-4" /> Gọi ngay
                  </a>
                  <a href={`/staff/chat/${activeTask.id}`} className="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Nhắn tin
                  </a>
                </div>
              </div>

              {activeTask.moTaSuCo && (
                <div>
                  <span className="text-slate-500 flex items-center gap-1 mb-1"><FileText className="w-4 h-4"/> Mô tả sự cố:</span>
                  <p className="italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">"{activeTask.moTaSuCo}"</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActiveRequests;
