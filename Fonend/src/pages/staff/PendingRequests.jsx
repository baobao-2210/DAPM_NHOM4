import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { MapPin, Phone, Car, Wrench, FileText, Check, X, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sửa lỗi icon của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PendingRequests = () => {
  const { user } = useAuth();
  const [staffId, setStaffId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy staffId
  useEffect(() => {
    const idTaiKhoan = user?._id || user?.id;
    if (idTaiKhoan) {
      axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`)
        .then(res => {
          setStaffId(res.data.idNhanVien);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  // Load Đơn mới
  const loadPendingRequests = async (hideLoading = false) => {
    if (!staffId) return;
    if (!hideLoading) setLoading(true);
    try {
      const res = await axiosClient.get(`/YeuCau/pending?staffId=${staffId}`);
      setRequests(res.data || []);
    } catch (error) {
      console.error(error);
      if (!hideLoading) toast.error('Không thể tải danh sách đơn mới');
    } finally {
      if (!hideLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRequests();
    
    // Polling tự động mỗi 5 giây để nhân viên thấy đơn ngay khi khách hàng tạo
    const interval = setInterval(() => {
      loadPendingRequests(true); // true = hide loading indicator during background fetch
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  const handleAccept = async (id) => {
    try {
      await axiosClient.post(`/YeuCau/${id}/accept`, { idNhanVien: staffId });
      toast.success('Nhận đơn thành công! Vui lòng chuyển sang "Đơn đang xử lý".');
      loadPendingRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể nhận đơn');
    }
  };

  const handleReject = (id) => {
    // Với logic hiện tại, từ chối đơn giản là ẩn nó khỏi màn hình của nhân viên này
    setRequests(requests.filter(r => r.id !== id));
    toast.success('Đã từ chối nhận đơn này.');
  };

  if (loading) return <Loading fullscreen={false} />;

  return (
    <div className="font-['Inter']">
      <PageHeader
        title="Đơn mới (Chờ tiếp nhận)"
        description="Các yêu cầu cứu hộ phù hợp với dịch vụ và khu vực của bạn."
      />

      {requests.length === 0 ? (
        <EmptyState 
          icon={Check} 
          title="Không có đơn mới" 
          description="Hiện tại chưa có yêu cầu cứu hộ nào chờ tiếp nhận." 
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {requests.map(req => (
            <Card key={req.id} className="overflow-hidden border border-slate-200 shadow-sm rounded-[16px]">
              <Card.Header className="bg-slate-50 border-b border-slate-100 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">#{req.id}</span>
                    <Badge variant="warning" size="sm">Chờ tiếp nhận</Badge>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(req.ngayTao).toLocaleString('vi-VN')}
                  </span>
                </div>
              </Card.Header>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin chi tiết */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="font-bold text-blue-600">{req.tenKhachHang.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{req.tenKhachHang}</p>
                      <p className="text-slate-600 flex items-center gap-1 mt-1">
                        <Phone className="w-3.5 h-3.5" /> {req.soDienThoai}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5"><Wrench className="w-4 h-4"/> Dịch vụ:</span>
                      <span className="font-semibold text-slate-800">{req.tenDichVu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5"><Car className="w-4 h-4"/> Xe:</span>
                      <span className="font-semibold text-slate-800">{req.hangXe} {req.dongXe} - {req.bienSo}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium"><MapPin className="w-4 h-4"/> Địa chỉ sự cố:</span>
                    <p className="text-slate-800 font-semibold bg-red-50 text-red-700 p-2 rounded-lg border border-red-100">
                      {req.noiSuCo}
                    </p>
                  </div>

                  {req.moTaSuCo && (
                    <div>
                      <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium"><FileText className="w-4 h-4"/> Mô tả:</span>
                      <p className="text-slate-700 bg-slate-50 p-2 rounded-lg italic">"{req.moTaSuCo}"</p>
                    </div>
                  )}

                  {/* Ảnh sự cố (nếu DB có lưu ảnh, mockup 1 khung ảnh) */}
                  <div>
                    <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium"><ImageIcon className="w-4 h-4"/> Ảnh đính kèm:</span>
                    <div className="flex gap-2">
                       <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs">Không có</div>
                    </div>
                  </div>
                </div>

                {/* Bản đồ nhỏ */}
                <div className="h-[250px] md:h-full min-h-[250px] rounded-xl overflow-hidden border border-slate-200 relative z-0">
                  <MapContainer 
                    center={[req.viDo || 16.0611, req.kinhDo || 108.2272]} 
                    zoom={14} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[req.viDo || 16.0611, req.kinhDo || 108.2272]}>
                      <Popup>{req.noiSuCo}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => handleAccept(req.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Nhận đơn
                </button>
                <button 
                  onClick={() => handleReject(req.id)}
                  className="flex-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                  <X className="w-5 h-5 text-red-500" /> Từ chối
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
