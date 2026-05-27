import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Link,
  Car,
  Zap,
  Gauge,
  ShieldCheck,
  FileText,
  CheckCircle,
} from "lucide-react";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const ServiceDetail = () => {
  const navigate = useNavigate();

  // ✅ ĐÀ NẴNG
  const center = { lat: 16.0544, lng: 108.2022 };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC3Qe2gdrLQ0-Q79IiOUym_hAibXewVfUA",
  });

  const pricingData = [
    { distance: "Dưới 5km", base: "600.000 VNĐ", extra: "0 VNĐ" },
    { distance: "5km - 20km", base: "850.000 VNĐ", extra: "15.000 VNĐ" },
    { distance: "Trên 20km", base: "1.200.000 VNĐ", extra: "12.000 VNĐ" },
  ];

  const equipment = [
    { icon: <Truck size={32} />, label: "Sàn trượt thủy lực" },
    { icon: <Link size={32} />, label: "Dây đai cố định" },
    { icon: <Car size={32} />, label: "Con lăn hỗ trợ kẹt bánh" },
    { icon: <Zap size={32} />, label: "Đèn tín hiệu LED" },
  ];

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7c93a3" }],
      },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "landscape", stylers: [{ color: "#f5f5f5" }] },
      { featureType: "road", stylers: [{ color: "#ffffff" }] },
      { featureType: "water", stylers: [{ color: "#c9d7e6" }] },
    ],
  };

  return (
    <div className="bg-[var(--bg-body)] text-[var(--text-main)] font-sans min-h-screen">
      <main className="pt-24 pb-32 max-w-7xl mx-auto px-6 animate-fade-in">
        {/* Section 1: Hero Banner */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* MAP HERO */}
          <div className="lg:w-2/3 relative overflow-hidden rounded-[2rem] h-[400px] shadow-2xl">
            {!isLoaded ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 font-black text-[var(--primary)]">
                Đang tải bản đồ...
              </div>
            ) : (
              <GoogleMap
                key={`${center.lat}-${center.lng}`} // ✅ bắt map load lại đúng tọa độ
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={14}
                options={mapOptions}
              >
                <Marker position={center} title="Đà Nẵng" />
              </GoogleMap>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-8 left-8 text-white pointer-events-none">
              <span className="bg-[var(--accent)] text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                Sẵn sàng 24/7
              </span>
              <h1 className="text-5xl font-black tracking-tight drop-shadow-lg">
                Cứu hộ kéo xe
              </h1>
            </div>
          </div>

          {/* Thẻ hành động nhanh */}
          <div className="lg:w-1/3 flex flex-col justify-between p-8 bg-white rounded-[2rem] shadow-xl border-l-8 border-[var(--primary)]">
            <div>
              <h3 className="font-black text-2xl mb-4 text-[var(--primary)]">
                Tóm tắt dịch vụ
              </h3>

              <p className="text-[var(--text-sub)] font-medium leading-relaxed mb-6">
                Giải pháp cứu hộ chuyên nghiệp cho các trường hợp sự cố động cơ,
                tai nạn. Đội ngũ kỹ thuật viên có mặt từ 15-30 phút.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Gauge size={18} />
                  </div>
                  Phản hồi cực nhanh
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  Bảo hiểm tài sản 100%
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/request")}
              className="w-full btn btn-primary py-5 rounded-full font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 group"
            >
              <Zap
                size={20}
                className="group-hover:text-[var(--accent)] transition-colors"
              />
              Yêu cầu cứu hộ ngay
            </button>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Mô tả */}
            <section className="card p-8 shadow-sm">
              <h2 className="font-black text-2xl mb-6 flex items-center gap-3 text-[var(--text-main)]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--primary)] flex items-center justify-center">
                  <FileText size={24} />
                </div>
                Mô tả chi tiết
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="text-[var(--text-sub)] leading-relaxed font-semibold">
                  Sử dụng dàn xe sàn trượt thủy lực đời mới nhất, RescueGuard đảm
                  bảo xe của bạn được vận chuyển êm ái, không ảnh hưởng đến hệ
                  thống truyền động.
                </p>

                <ul className="space-y-4">
                  {[
                    "Hỗ trợ Sedan, SUV, Xe tải nhẹ",
                    "Cứu hộ mọi điều kiện thời tiết",
                    "Định vị xe kéo theo thời gian thực",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm font-bold text-[var(--text-main)]"
                    >
                      <CheckCircle
                        className="text-[var(--primary)] shrink-0"
                        size={20}
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Bảng giá */}
            <section className="card p-8 shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-black text-2xl text-[var(--text-main)]">
                  Bảng giá dự kiến
                </h2>
                <span className="text-xs text-[var(--text-muted)] italic font-black uppercase tracking-widest">
                  * Giá thực tế tùy địa hình
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-body)]">
                      <th className="p-5 font-black rounded-l-2xl text-[var(--text-muted)] uppercase tracking-widest text-xs">
                        Khoảng cách
                      </th>
                      <th className="p-5 font-black text-[var(--text-muted)] uppercase tracking-widest text-xs">
                        Giá cơ bản
                      </th>
                      <th className="p-5 font-black rounded-r-2xl text-right text-[var(--text-muted)] uppercase tracking-widest text-xs">
                        Phụ phí/km
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)]">
                    {pricingData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-5 font-black text-[var(--primary)]">
                          {row.distance}
                        </td>
                        <td className="p-5 font-bold text-[var(--text-main)]">
                          {row.base}
                        </td>
                        <td className="p-5 text-right font-bold text-[var(--text-main)]">
                          {row.extra}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-slate-100 p-8 rounded-[2rem] border border-[var(--border)]">
              <h2 className="font-black text-xl mb-6 text-[var(--text-main)]">
                Thiết bị hỗ trợ
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {equipment.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-[var(--primary)]/20"
                  >
                    <div className="text-[var(--primary)] mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-sub)]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-amber-100 p-6 rounded-[2rem] flex items-center gap-4 border border-amber-200">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-amber-600 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-amber-600 rounded-full relative"></div>
              </div>

              <div>
                <p className="font-black text-amber-900">12 xe đang hoạt động</p>
                <p className="text-xs text-amber-800/80 font-bold mt-0.5 uppercase tracking-widest">
                  Khu vực Đà Nẵng
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;