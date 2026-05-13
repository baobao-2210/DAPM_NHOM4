import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { MapPin, Wrench, Car, Truck, Flag, Map, Moon, ChevronRight } from 'lucide-react';

const CostEstimation = () => {
  // 1. Cấu hình tọa độ (Ví dụ: Điểm sự cố và Điểm đến tại Đà Nẵng)
  const incidentLoc = { lat: 16.0544, lng: 108.2022 };
  const destinationLoc = { lat: 16.0744, lng: 108.2222 };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC3Qe2gdrLQ0-Q79IiOUym_hAibXewVfUA" // Key của bạn
  });

  const priceDetails = [
    { id: 1, label: "Phí cơ bản", sub: "Điều xe & 2km đầu", value: "300.000đ", icon: <Flag size={20} />, bg: "bg-slate-100", color: "text-slate-500" },
    { id: 2, label: "Phí khoảng cách", sub: "6.4 km x 25.000đ/km", value: "160.000đ", icon: <Map size={20} />, bg: "bg-slate-100", color: "text-slate-500" },
    { id: 3, label: "Phụ phí đêm", sub: "Khung giờ 22:00 - 05:00", value: "92.000đ", icon: <Moon size={20} />, bg: "bg-orange-100", color: "text-orange-500" }
  ];

  const mapOptions = {
    disableDefaultUI: true,
    styles: [
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
    ]
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-[var(--primary)]">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen w-full">
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full animate-fade-in">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">Chi tiết yêu cầu cứu hộ</h1>
          <p className="text-[var(--text-sub)] mt-2 font-medium">Kiểm tra lộ trình và chi phí trước khi xác nhận.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* BẢN ĐỒ THẬT */}
          <div className="xl:col-span-7 space-y-6">
            <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[var(--border)]">
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
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl flex-1 flex items-center gap-3 border border-[var(--border)] shadow-xl pointer-events-auto">
                  <MapPin className="text-[var(--primary)] shrink-0" size={24} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Từ</p>
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">221B Nguyễn Văn Cừ</p>
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl flex-1 flex items-center gap-3 border border-[var(--border)] shadow-xl pointer-events-auto">
                  <Wrench className="text-amber-600 shrink-0" size={24} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Đến</p>
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">Garage AutoPro</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Car size={24} />
                </div>
                <p className="font-bold text-sm text-[var(--text-main)]">Toyota Camry (51A-123.45)</p>
              </div>
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Truck size={24} />
                </div>
                <p className="font-bold text-sm text-[var(--text-main)]">Xe kéo sàn trượt</p>
              </div>
            </div>
          </div>

          {/* BẢNG TÍNH GIÁ */}
          <div className="xl:col-span-5">
            <div className="card p-8 sticky top-28 shadow-xl border-2 border-[var(--primary)]/10">
              <h2 className="text-2xl font-black mb-8 text-[var(--text-main)]">Ước tính phí</h2>

              <div className="space-y-5 mb-10">
                {priceDetails.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-main)]">{item.label}</p>
                        <p className="text-[10px] text-[var(--text-sub)] font-medium mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--text-main)]">{item.value}</span>
                  </div>
                ))}

                <div className="pt-8 border-t border-[var(--border)] flex justify-between items-end">
                  <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Tổng cộng</p>
                  <span className="text-5xl font-black text-[var(--primary)] tracking-tight">552.000đ</span>
                </div>
              </div>

              <button className="btn btn-primary w-full py-5 rounded-full font-black text-lg shadow-xl flex items-center justify-center gap-2 group">
                Xác nhận yêu cầu <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostEstimation;