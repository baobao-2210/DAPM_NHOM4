import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const CostEstimation = () => {
  // 1. Cấu hình tọa độ (Ví dụ: Điểm sự cố và Điểm đến tại Đà Nẵng)
  const incidentLoc = { lat: 16.0544, lng: 108.2022 };
  const destinationLoc = { lat: 16.0744, lng: 108.2222 };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC3Qe2gdrLQ0-Q79IiOUym_hAibXewVfUA" // Key của bạn
  });

  const priceDetails = [
    { id: 1, label: "Phí cơ bản", sub: "Điều xe & 2km đầu", value: "300.000đ", icon: "flag", bg: "bg-slate-50", color: "text-slate-400" },
    { id: 2, label: "Phí khoảng cách", sub: "6.4 km x 25.000đ/km", value: "160.000đ", icon: "add_road", bg: "bg-slate-50", color: "text-slate-400" },
    { id: 3, label: "Phụ phí đêm", sub: "Khung giờ 22:00 - 05:00", value: "92.000đ", icon: "dark_mode", bg: "bg-orange-50", color: "text-orange-400" }
  ];

  const mapOptions = {
    disableDefaultUI: true,
    styles: [
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
    ]
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-[#003fb1]">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen w-full">
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-[#003fb1] font-['Manrope']">Chi tiết yêu cầu cứu hộ</h1>
          <p className="text-[#434654] mt-2 font-medium">Kiểm tra lộ trình và chi phí trước khi xác nhận.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* BẢN ĐỒ THẬT */}
          <div className="xl:col-span-7 space-y-6">
            <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#edeef0]">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={incidentLoc}
                zoom={14}
                options={mapOptions}
              >
                <Marker position={incidentLoc} label="Sự cố" />
                <Marker position={destinationLoc} label="Điểm đến" />
                <Polyline 
                  path={[incidentLoc, destinationLoc]} 
                  options={{ strokeColor: "#003fb1", strokeWeight: 4, strokeOpacity: 0.8 }} 
                />
              </GoogleMap>
              
              {/* Overlay địa chỉ (Glassmorphism) */}
              <div className="absolute top-6 left-6 right-6 flex flex-col sm:flex-row gap-3 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex-1 flex items-center gap-3 border border-white/20 shadow-lg pointer-events-auto">
                  <span className="material-symbols-outlined text-[#003fb1]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[#003fb1] uppercase">Từ</p>
                    <p className="text-sm font-bold truncate">221B Nguyễn Văn Cừ</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex-1 flex items-center gap-3 border border-white/20 shadow-lg pointer-events-auto">
                  <span className="material-symbols-outlined text-[#735c00]" style={{ fontVariationSettings: "'FILL' 1" }}>garage</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[#735c00] uppercase">Đến</p>
                    <p className="text-sm font-bold truncate">Garage AutoPro</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4 border border-[#edeef0]">
                <span className="material-symbols-outlined text-[#003fb1] text-3xl">directions_car</span>
                <p className="font-bold text-sm">Toyota Camry (51A-123.45)</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4 border border-[#edeef0]">
                <span className="material-symbols-outlined text-[#735c00] text-3xl">auto_towing</span>
                <p className="font-bold text-sm">Xe kéo sàn trượt</p>
              </div>
            </div>
          </div>

          {/* BẢNG TÍNH GIÁ */}
          <div className="xl:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#edeef0] sticky top-28">
              <h2 className="text-2xl font-black font-['Manrope'] mb-8 text-[#191c1e]">Ước tính phí</h2>

              <div className="space-y-5 mb-10">
                {priceDetails.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-[10px] text-[#737686] font-medium">{item.sub}</p>
                      </div>
                    </div>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}

                <div className="pt-8 border-t border-[#edeef0] flex justify-between items-end">
                  <p className="text-xs font-black text-[#737686] uppercase tracking-widest">Tổng cộng</p>
                  <span className="text-5xl font-black text-[#003fb1] tracking-tighter">552.000đ</span>
                </div>
              </div>

              <button className="w-full bg-[#003fb1] text-white py-5 rounded-full font-black text-xl shadow-xl hover:bg-[#1a56db] transition-all active:scale-95 flex items-center justify-center gap-3">
                Xác nhận yêu cầu <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostEstimation;