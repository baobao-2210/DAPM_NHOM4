import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

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

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-[#003fb1]">Đang tải bản đồ...</div>;

  return (
    <div className="bg-[#f8f9fb] font-['Inter'] h-screen flex flex-col overflow-hidden text-[#191c1e]">
      <main className="flex-1 md:pl-64 pt-16 h-full flex flex-col md:flex-row">
        
        {/* PANEL TRÁI: THÔNG TIN CHI TIẾT */}
        <section className="w-full md:w-[380px] h-full bg-white border-r border-[#edeef0] flex flex-col overflow-y-auto z-20 shadow-2xl">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-black font-['Manrope'] tracking-tight mb-2 text-[#003fb1]">Tiến trình cứu hộ</h1>
              <p className="text-[#737686] text-[10px] font-black uppercase tracking-widest">Mã: #RG-2026-MUSÉ</p>
            </header>

            {/* Status Timeline */}
            <div className="space-y-8 mb-10">
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[#003fb1] flex items-center justify-center text-white z-10 shrink-0 shadow-lg shadow-[#003fb1]/30">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
                <div className="absolute left-4 top-8 w-0.5 h-10 bg-[#003fb1]/20"></div>
                <div>
                  <p className="text-sm font-bold text-[#003fb1]">Đã tiếp nhận yêu cầu</p>
                  <p className="text-[10px] text-[#737686]">15:05 • Hệ thống đã xác nhận</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[#fed01b] flex items-center justify-center text-[#6f5900] z-10 shrink-0 animate-pulse shadow-lg shadow-[#fed01b]/30">
                  <div className="w-2 h-2 rounded-full bg-[#6f5900]"></div>
                </div>
                <div>
                  <p className="text-sm font-bold">Kỹ thuật viên đang đến</p>
                  <p className="text-[10px] text-[#737686]">Dự kiến: 08 phút nữa</p>
                </div>
              </div>
            </div>

            {/* Technician Profile */}
            <div className="bg-[#f3f4f6] p-6 rounded-[2rem] border border-[#edeef0] mb-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src="https://i.pravatar.cc/150?u=tech" alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#191c1e]">Nguyễn Văn Nam</h3>
                  <div className="flex items-center text-[#735c00] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9 (124)
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#003fb1] text-white py-3 rounded-full text-xs font-bold shadow-lg hover:bg-[#1a56db] transition-all flex items-center justify-center gap-2 active:scale-95">
                  <span className="material-symbols-outlined text-sm">chat</span> Nhắn tin
                </button>
                <button className="w-12 h-12 rounded-full border border-[#c3c5d7] flex items-center justify-center text-[#003fb1] hover:bg-white active:scale-90 transition-all">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>

            {/* Problem Report */}
            <div className="p-4 bg-[#ffdad6] rounded-2xl border border-[#ba1a1a]/10">
              <p className="text-[10px] font-black text-[#93000a] mb-1 uppercase tracking-tighter">Sự cố báo cáo</p>
              <p className="text-xs text-[#93000a]/80 leading-relaxed font-medium">Xe hết bình ắc quy, cần kích bình gấp tại vị trí hiện tại.</p>
            </div>
          </div>
        </section>

        {/* PANEL PHẢI: BẢN ĐỒ GOOGLE MAPS */}
        <section className="flex-1 relative bg-[#e5e7eb]">
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
          <div className="absolute top-6 left-6 p-5 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-12 h-12 rounded-full bg-[#fed01b] flex items-center justify-center text-[#6f5900] shadow-inner">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
            </div>
            <div>
              <p className="text-[10px] text-[#737686] font-black uppercase tracking-widest">Thời gian dự kiến</p>
              <p className="text-2xl font-['Manrope'] font-black text-[#003fb1]">08 Phút</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-10 right-8 flex flex-col gap-2">
            <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-[#003fb1] hover:bg-white transition-all active:scale-90 border border-white">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RescueTracking;