import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Phone, MessageSquare, Navigation, MapPin } from 'lucide-react';
import { customerApi } from '../../api/customerApi';

// Custom icons
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

// Component to handle map bounds
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

const LiveTracking = () => {
  const { requestId } = useParams();
  
  // Mock data
  const customerPos = [16.0611, 108.2272]; // Da Nang (Cầu Rồng)
  const initialStaffPos = [16.0544, 108.2022]; // Da Nang center
  
  const [staffPos, setStaffPos] = useState(initialStaffPos);
  const [eta, setEta] = useState(15);
  const [distance, setDistance] = useState(3.2);
  const [reqDetail, setReqDetail] = useState(null);

  // Fetch request data
  useEffect(() => {
    const fetchReq = async () => {
      try {
        const res = await customerApi.getRequestDetail(requestId);
        setReqDetail(res.data?.data || res.data);
      } catch (err) {
        console.error('Failed to fetch request detail', err);
      }
    };
    fetchReq();
    const pollInterval = setInterval(fetchReq, 10000); // Poll every 10s
    return () => clearInterval(pollInterval);
  }, [requestId]);

  // Simulate staff moving
  useEffect(() => {
    const interval = setInterval(() => {
      setStaffPos(prev => {
        const newLat = prev[0] + (customerPos[0] - prev[0]) * 0.05;
        const newLng = prev[1] + (customerPos[1] - prev[1]) * 0.05;
        return [newLat, newLng];
      });
      setEta(prev => Math.max(1, prev - 1));
      setDistance(prev => Math.max(0.1, prev - 0.2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] -m-6 lg:-m-8">
      {/* Map */}
      <MapContainer 
        center={customerPos} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={customerPos} icon={customerIcon}>
          <Popup>Vị trí của bạn</Popup>
        </Marker>
        <Marker position={staffPos} icon={staffIcon}>
          <Popup>Nhân viên cứu hộ</Popup>
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

      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between pointer-events-none">
        <Link 
          to={`/customer/rescue-requests/${requestId}`}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0F172A] hover:bg-[#F8FAFC] pointer-events-auto transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Tracking Card - Grab Style */}
      <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-20 pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E2E8F0]">
          {/* ETA Header */}
          <div className="bg-[#1D4ED8] p-4 flex items-center justify-between text-white">
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Dự kiến đến nơi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{eta}</span>
                <span className="font-semibold text-white/90">phút</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-semibold mb-1">Khoảng cách</p>
              <p className="font-bold">{distance.toFixed(1)} km</p>
            </div>
          </div>

          {/* Staff Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#1D4ED8]/20 flex items-center justify-center text-[#1D4ED8] font-bold text-lg uppercase">
                  {reqDetail?.staffName?.[0] || 'N'}
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A]">{reqDetail?.staffName || 'Đang phân công...'}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-[#64748B]">{reqDetail?.staffPhone || 'Chưa có SĐT'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#F1F5F9]">
              <MapPin className="w-5 h-5 text-[#EF4444] shrink-0" />
              <p className="text-sm text-[#0F172A] font-medium line-clamp-1">
                {reqDetail?.address || 'Cầu Rồng, Q. Hải Châu, Đà Nẵng'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E0E7FF] text-[#1D4ED8] font-semibold rounded-xl hover:bg-[#C7D2FE] transition-colors">
                <Phone className="w-5 h-5" />
                Gọi điện
              </button>
              <Link 
                to={`/customer/chat/${requestId}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E0E7FF] text-[#1D4ED8] font-semibold rounded-xl hover:bg-[#C7D2FE] transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Nhắn tin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
