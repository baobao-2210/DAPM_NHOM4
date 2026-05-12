import React from 'react';
import { useNavigate } from 'react-router-dom';
const ServiceDetail = () => {
  const navigate = useNavigate();
  const pricingData = [
    { distance: "Dưới 5km", base: "600.000 VNĐ", extra: "0 VNĐ" },
    { distance: "5km - 20km", base: "850.000 VNĐ", extra: "15.000 VNĐ" },
    { distance: "Trên 20km", base: "1.200.000 VNĐ", extra: "12.000 VNĐ" },
  ];

  const equipment = [
    { icon: "rv_hookup", label: "Sàn trượt thủy lực" },
    { icon: "settings_input_component", label: "Dây đai cố định" },
    { icon: "car_crash", label: "Con lăn hỗ trợ kẹt bánh" },
    { icon: "flashlight_on", label: "Đèn tín hiệu LED" },
  ];

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans min-h-screen">
      {/* LƯU Ý: Nếu bạn đã đặt Navbar ở App.jsx thì phần main 
          cần pt-24 (padding top) để không bị che mất nội dung.
      */}
      <main className="pt-24 pb-32 max-w-7xl mx-auto px-6">
        
        {/* Section 1: Hero Banner */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-2/3 relative overflow-hidden rounded-[2rem] h-[400px] shadow-xl">
            <img 
              alt="Professional tow truck service" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1563906267088-b0bc2f917bb0?auto=format&fit=crop&q=80&w=1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <span className="bg-[#fed01b] text-[#6f5900] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Sẵn sàng 24/7</span>
              <h1 className="text-5xl font-black font-['Manrope'] tracking-tight">Cứu hộ kéo xe</h1>
            </div>
          </div>

          {/* Thẻ hành động nhanh */}
          <div className="lg:w-1/3 flex flex-col justify-between p-8 bg-white rounded-[2rem] shadow-sm border-l-8 border-[#003fb1]">
            <div>
              <h3 className="font-['Manrope'] font-bold text-xl mb-4 text-[#003fb1]">Tóm tắt dịch vụ</h3>
              <p className="text-[#434654] leading-relaxed mb-6">
                Giải pháp cứu hộ chuyên nghiệp cho các trường hợp sự cố động cơ, tai nạn. Đội ngũ kỹ thuật viên có mặt từ 15-30 phút.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="material-symbols-outlined text-[#003fb1]">speed</span>
                  Phản hồi cực nhanh
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="material-symbols-outlined text-[#003fb1]">verified_user</span>
                  Bảo hiểm tài sản 100%
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/request')}
              className="w-full bg-[#003fb1] text-white py-5 rounded-full font-bold text-lg hover:bg-[#1a56db] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-8"
            >
              <span className="material-symbols-outlined">flash_on</span>
              Yêu cầu cứu hộ ngay
            </button>
          </div>
        </div>

        {/* Section 2: Thông tin chi tiết & Bảng giá */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Mô tả */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
              <h2 className="font-['Manrope'] font-bold text-2xl mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003fb1]">description</span>
                Mô tả chi tiết
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="text-[#434654] leading-relaxed font-medium">
                  Sử dụng dàn xe sàn trượt thủy lực đời mới nhất, RescueGuard đảm bảo xe của bạn được vận chuyển êm ái, không ảnh hưởng đến hệ thống truyền động.
                </p>
                <ul className="space-y-3">
                  {['Hỗ trợ Sedan, SUV, Xe tải nhẹ', 'Cứu hộ mọi điều kiện thời tiết', 'Định vị xe kéo theo thời gian thực'].map((text, i) => (
                    <li key={i} className="flex gap-2 text-sm font-bold text-[#191c1e]">
                      <span className="material-symbols-outlined text-[#003fb1] scale-75">check_circle</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Bảng giá */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-['Manrope'] font-bold text-2xl">Bảng giá dự kiến</h2>
                <span className="text-xs text-[#737686] italic font-medium">* Giá thực tế tùy địa hình</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f3f4f6]">
                      <th className="p-4 font-bold rounded-l-2xl text-[#737686] uppercase text-xs">Khoảng cách</th>
                      <th className="p-4 font-bold text-[#737686] uppercase text-xs">Giá cơ bản</th>
                      <th className="p-4 font-bold rounded-r-2xl text-right text-[#737686] uppercase text-xs">Phụ phí/km</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edeef0]">
                    {pricingData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#f8f9fb] transition-colors">
                        <td className="p-4 font-bold text-[#003fb1]">{row.distance}</td>
                        <td className="p-4 font-medium">{row.base}</td>
                        <td className="p-4 text-right font-medium">{row.extra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Cột phải: Thiết bị & Trạng thái */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-[#edeef0] p-8 rounded-[2rem]">
              <h2 className="font-['Manrope'] font-bold text-xl mb-6">Thiết bị hỗ trợ</h2>
              <div className="grid grid-cols-2 gap-4">
                {equipment.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl text-center flex flex-col items-center shadow-sm">
                    <span className="material-symbols-outlined text-[#003fb1] text-3xl mb-2">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase text-[#434654]">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Trạng thái xe trực tuyến */}
            <div className="bg-[#ffe083] p-6 rounded-[2rem] flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 bg-[#735c00] rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-[#735c00] rounded-full relative"></div>
              </div>
              <div>
                <p className="font-black text-[#231b00]">12 xe đang hoạt động</p>
                <p className="text-xs text-[#574500] font-bold">Khu vực TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;