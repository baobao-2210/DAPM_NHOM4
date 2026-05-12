import { useNavigate } from 'react-router-dom';

const RescueHistory = () => {
  const navigate = useNavigate();
  // Dữ liệu giả lập cho lịch sử cứu hộ
  const historyData = [
    {
      id: "#RQ-88219",
      status: "Hoàn thành",
      statusColor: "bg-green-100 text-green-800",
      title: "Thay lốp dự phòng & Kích bình",
      time: "14:30, 24 Tháng 05, 2026",
      location: "Q. Bình Thạnh, TP. HCM",
      technician: "Nguyễn Văn An",
      techImg: "https://i.pravatar.cc/100?img=11",
      cost: "450.000đ",
      icon: "car_repair",
      hasRating: false
    },
    {
      id: "#RQ-87910",
      status: "Đã hủy",
      statusColor: "bg-slate-100 text-slate-600",
      title: "Cứu hộ kéo xe về gara",
      time: "09:15, 12 Tháng 05, 2026",
      location: "Q. Thủ Đức, TP. HCM",
      technician: null,
      techImg: null,
      cost: "0đ",
      icon: "auto_towing",
      hasRating: false
    },
    {
      id: "#RQ-87102",
      status: "Hoàn thành",
      statusColor: "bg-green-100 text-green-800",
      title: "Sửa khóa xe khẩn cấp",
      time: "21:00, 29 Tháng 04, 2026",
      location: "Q. 7, TP. HCM",
      technician: "Lê Thị Thu",
      techImg: "https://i.pravatar.cc/100?img=5",
      cost: "300.000đ",
      icon: "build",
      hasRating: true,
      rating: "5.0"
    }
  ];

  const stats = [
    { label: "Tổng cộng", value: "12", sub: "Yêu cầu đã thực hiện", icon: "task_alt", primary: true },
    { label: "Chi tiêu", value: "4,500,000đ", sub: "Tổng chi phí năm nay", icon: "payments" },
    { label: "Hạng thành viên", value: "Bạc", sub: "Giảm 5% phí dịch vụ", icon: "verified" }
  ];

  return (
    <div className="bg-[#f8f9fb] min-h-screen font-['Inter'] text-[#191c1e]">
      {/* pt-24 để tránh bị Navbar che khuất */}
      <main className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-['Manrope'] font-black tracking-tight mb-4 text-[#191c1e]">
            Lịch sử cứu hộ
          </h1>
          <p className="text-[#434654] max-w-2xl text-lg">
            Theo dõi và quản lý tất cả các yêu cầu hỗ trợ kỹ thuật và cứu hộ xe của bạn.
          </p>
        </header>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-between h-40 transition-all duration-300 group ${
                stat.primary ? 'bg-white hover:bg-[#003fb1]' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`material-symbols-outlined text-3xl ${stat.primary ? 'text-[#003fb1] group-hover:text-white' : 'text-[#735c00]'}`}>
                  {stat.icon}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.primary ? 'text-[#737686] group-hover:text-white/60' : 'text-[#737686]'}`}>
                  {stat.label}
                </span>
              </div>
              <div>
                <div className={`text-3xl font-black font-['Manrope'] ${stat.primary ? 'group-hover:text-white' : ''}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.primary ? 'text-[#434654] group-hover:text-white/80' : 'text-[#434654]'}`}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 bg-[#edeef0] p-1.5 rounded-2xl w-fit">
            <button className="px-6 py-2 rounded-xl text-sm font-bold bg-white text-[#003fb1] shadow-sm">Tất cả</button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold text-[#434654] hover:bg-white/50 transition-colors">Hoàn thành</button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold text-[#434654] hover:bg-white/50 transition-colors">Đã hủy</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full justify-end">
            <button
              type="button"
              onClick={() => navigate('/cancel')}
              className="px-6 py-3 rounded-full bg-[#ba1a1a] text-white font-black text-sm hover:opacity-90 transition-all"
            >
              Hủy yêu cầu
            </button>
            <div className="relative w-full sm:w-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#003fb1]">search</span>
              <input 
                className="bg-white border-0 ring-1 ring-[#edeef0] focus:ring-2 focus:ring-[#003fb1]/20 rounded-2xl pl-12 pr-4 py-3 w-full md:w-72 outline-none" 
                placeholder="Tìm mã yêu cầu..." 
                type="text"
              />
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {historyData.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#edeef0]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.status === 'Đã hủy' ? 'bg-[#f3f4f6]' : 'bg-[#dbe1ff]'}`}>
                    <span className={`material-symbols-outlined text-3xl ${item.status === 'Đã hủy' ? 'text-[#737686]' : 'text-[#003fb1]'}`}>
                      {item.icon === 'auto_towing' ? 'car_repair' : item.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-[#737686] tracking-widest uppercase">{item.id}</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-['Manrope']">{item.title}</h3>
                    <p className="text-sm text-[#434654]">{item.time} • {item.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 lg:gap-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#737686] uppercase mb-1">Nhân viên</span>
                    {item.technician ? (
                      <div className="flex items-center gap-2">
                        <img src={item.techImg} alt="tech" className="w-6 h-6 rounded-full border border-[#edeef0]" />
                        <span className="font-bold text-sm">{item.technician}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm text-[#c3c5d7]">Không có</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#737686] uppercase mb-1">Chi phí</span>
                    <span className="font-black text-[#003fb1]">{item.cost}</span>
                  </div>
                  <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
                    {item.status === 'Hoàn thành' ? (
                      item.hasRating ? (
                        <div className="flex items-center bg-[#fed01b] px-4 py-2.5 rounded-full text-[#6f5900] font-black text-xs">
                          <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {item.rating}
                        </div>
                      ) : (
                        <button className="bg-[#003fb1] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase hover:bg-[#1a56db] transition-all active:scale-95">
                          Đánh giá
                        </button>
                      )
                    ) : (
                      <button className="bg-[#f3f4f6] text-[#434654] px-6 py-2.5 rounded-full text-xs font-black uppercase hover:bg-[#edeef0] transition-all">
                        Chi tiết hủy
                      </button>
                    )}
                    <button className="p-2 hover:bg-[#f3f4f6] rounded-full transition-colors">
                      <span className="material-symbols-outlined text-[#737686]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="group flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#737686]">Xem thêm lịch sử</span>
            <span className="material-symbols-outlined text-[#003fb1] animate-bounce mt-2">keyboard_double_arrow_down</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default RescueHistory;