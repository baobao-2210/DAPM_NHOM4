import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { Check, Star, MessageCircle, Phone, Timer, Crosshair } from 'lucide-react';

const RescueTracking = () => {
  // Tọa độ người dùng và xe (Đà Nẵng làm mẫu)
  const [userLocation] = useState({ lat: 16.0544, lng: 108.2022 });
  const [techLocation, setTechLocation] = useState({ lat: 16.0620, lng: 108.2150 });

  // Logic giả lập xe di chuyển
  useEffect(() => {
    const interval = setInterval(() => {
      setTechLocation(prev => {
        const step = 0.00005; // Tốc độ di chuyển nhỏ để mượt hơn
        const newLat = prev.lat > userLocation.lat ? prev.lat - step : prev.lat;
        const newLng = prev.lng > userLocation.lng ? prev.lng - step : prev.lng;
        return { lat: newLat, lng: newLng };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [userLocation]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC3Qe2gdrLQ0-Q79IiOUym_hAibXewVfUA" // Key của bạn
  });

  // Tùy chỉnh giao diện bản đồ chuyên nghiệp (Silver Theme)
  const mapOptions = {
    disableDefaultUI: true,
    styles: [
      { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }] },
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "landscape", "stylers": [{ "color": "#f5f5f5" }] }
    ]
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-[var(--primary)]">Đang tải bản đồ...</div>;

  return (
    <div className="bg-[var(--bg-body)] font-sans h-screen flex flex-col overflow-hidden text-[var(--text-main)]">
      <main className="flex-1 md:pl-64 pt-16 h-full flex flex-col md:flex-row">
        
        {/* PANEL TRÁI: THÔNG TIN CHI TIẾT */}
        <section className="w-full md:w-[380px] h-full bg-white border-r border-[var(--border)] flex flex-col overflow-y-auto z-20 shadow-2xl animate-fade-in">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-black tracking-tight mb-2 text-[var(--text-main)]">Tiến trình cứu hộ</h1>
              <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Mã: #RG-2026-MUSÉ</p>
            </header>

            {/* Status Timeline */}
            <div className="space-y-8 mb-10">
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white z-10 shrink-0 shadow-lg shadow-[var(--primary)]/30">
                  <Check size={16} strokeWidth={3} />
                </div>
                <div className="absolute left-4 top-8 w-0.5 h-10 bg-[var(--primary)]/20"></div>
                <div>
                  <p className="text-sm font-bold text-[var(--primary)]">Đã tiếp nhận yêu cầu</p>
                  <p className="text-[10px] text-[var(--text-sub)] font-medium mt-1">15:05 • Hệ thống đã xác nhận</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-amber-900 z-10 shrink-0 animate-pulse shadow-lg shadow-[var(--accent)]/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-900"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">Kỹ thuật viên đang đến</p>
                  <p className="text-[10px] text-[var(--text-sub)] font-medium mt-1">Dự kiến: 08 phút nữa</p>
                </div>
              </div>
            </div>

            {/* Technician Profile */}
            <div className="bg-[var(--bg-body)] p-6 rounded-[2rem] border border-[var(--border)] mb-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src="https://i.pravatar.cc/150?u=tech" alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-main)]">Nguyễn Văn Nam</h3>
                  <div className="flex items-center text-amber-600 text-[11px] font-bold mt-1">
                    <Star size={12} fill="currentColor" className="mr-1" /> 4.9 (124)
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[var(--primary)] text-white py-3 rounded-2xl text-xs font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <MessageCircle size={16} /> Nhắn tin
                </button>
                <button className="w-12 h-12 rounded-2xl border border-[var(--border)] flex items-center justify-center text-[var(--primary)] bg-white hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 active:scale-90 transition-all shadow-sm">
                  <Phone size={18} />
                </button>
              </div>
            </div>

            {/* Problem Report */}
            <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-[10px] font-black text-red-700 mb-1.5 uppercase tracking-widest">Sự cố báo cáo</p>
              <p className="text-xs text-red-900/80 leading-relaxed font-semibold">Xe hết bình ắc quy, cần kích bình gấp tại vị trí hiện tại.</p>
            </div>
          </div>
        </section>

        {/* PANEL PHẢI: BẢN ĐỒ GOOGLE MAPS */}
        <section className="flex-1 relative bg-slate-100">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation}
            zoom={15}
            options={mapOptions}
          >
            {/* Vị trí người dùng (Marker đỏ mặc định để không lệch) */}
            <Marker 
              position={userLocation}
              title="Vị trí của bạn"
            />

            {/* Vị trí xe cứu hộ - Fix lệch bằng Anchor */}
            <Marker 
              position={techLocation}
              icon={{
                url: "https://cdn-icons-png.flaticon.com/512/1048/1048329.png",
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                // Căn icon vào đúng tâm tọa độ
                anchor: new window.google.maps.Point(20, 20)
              }}
            />

            {/* Đường lộ trình nét đứt chuyên nghiệp */}
            <Polyline
              path={[userLocation, techLocation]}
              options={{
                strokeColor: "#003fb1",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                icons: [{
                  icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                  offset: '0',
                  repeat: '20px'
                }]
              }}
            />
          </GoogleMap>

          {/* Overlay UI: ETA Badge */}
          <div className="absolute top-6 left-6 p-5 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white flex items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-amber-900 shadow-inner">
              <Timer size={24} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-sub)] font-black uppercase tracking-widest">Thời gian dự kiến</p>
              <p className="text-2xl font-black text-[var(--primary)] tracking-tight">08 Phút</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-10 right-8 flex flex-col gap-2">
            <button className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all active:scale-90 border border-white">
              <Crosshair size={20} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RescueTracking;