import { useNavigate } from 'react-router-dom';
import { CheckCircle, Wallet, ShieldCheck, Search, Star, ChevronRight, ChevronsDown, Wrench, Truck, Settings } from 'lucide-react';

const RescueHistory = () => {
  const navigate = useNavigate();
  // Dữ liệu giả lập cho lịch sử cứu hộ
  const historyData = [
    {
      id: "#RQ-88219",
      status: "Hoàn thành",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      title: "Thay lốp dự phòng & Kích bình",
      time: "14:30, 24 Tháng 05, 2026",
      location: "Q. Bình Thạnh, TP. HCM",
      technician: "Nguyễn Văn An",
      techImg: "https://i.pravatar.cc/100?img=11",
      cost: "450.000đ",
      icon: <Settings size={32} />,
      hasRating: false
    },
    {
      id: "#RQ-87910",
      status: "Đã hủy",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
      title: "Cứu hộ kéo xe về gara",
      time: "09:15, 12 Tháng 05, 2026",
      location: "Q. Thủ Đức, TP. HCM",
      technician: null,
      techImg: null,
      cost: "0đ",
      icon: <Truck size={32} />,
      hasRating: false
    },
    {
      id: "#RQ-87102",
      status: "Hoàn thành",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      title: "Sửa khóa xe khẩn cấp",
      time: "21:00, 29 Tháng 04, 2026",
      location: "Q. 7, TP. HCM",
      technician: "Lê Thị Thu",
      techImg: "https://i.pravatar.cc/100?img=5",
      cost: "300.000đ",
      icon: <Wrench size={32} />,
      hasRating: true,
      rating: "5.0"
    }
  ];

  const stats = [
    { label: "Tổng cộng", value: "12", sub: "Yêu cầu đã thực hiện", icon: <CheckCircle size={32} />, primary: true },
    { label: "Chi tiêu", value: "4,500,000đ", sub: "Tổng chi phí năm nay", icon: <Wallet size={32} /> },
    { label: "Hạng thành viên", value: "Bạc", sub: "Giảm 5% phí dịch vụ", icon: <ShieldCheck size={32} /> }
  ];

  return (
    <div className="bg-[var(--bg-body)] min-h-screen font-sans text-[var(--text-main)]">
      <main className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[var(--text-main)]">
            Lịch sử cứu hộ
          </h1>
          <p className="text-[var(--text-sub)] max-w-2xl text-lg font-medium">
            Theo dõi và quản lý tất cả các yêu cầu hỗ trợ kỹ thuật và cứu hộ xe của bạn.
          </p>
        </header>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-between h-40 transition-all duration-300 group border ${
                stat.primary ? 'bg-[var(--primary)] text-white border-transparent hover:shadow-lg hover:shadow-[var(--primary)]/20 hover:-translate-y-1' : 'bg-white border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={stat.primary ? 'text-white' : 'text-amber-600'}>
                  {stat.icon}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.primary ? 'text-blue-200' : 'text-[var(--text-muted)]'}`}>
                  {stat.label}
                </span>
              </div>
              <div>
                <div className={`text-3xl font-black ${stat.primary ? 'text-white' : 'text-[var(--text-main)]'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.primary ? 'text-blue-100' : 'text-[var(--text-sub)]'}`}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 bg-[var(--border)] p-1.5 rounded-2xl w-fit">
            <button className="px-6 py-2 rounded-xl text-sm font-bold bg-white text-[var(--primary)] shadow-sm">Tất cả</button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold text-[var(--text-sub)] hover:bg-white/50 transition-colors">Hoàn thành</button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold text-[var(--text-sub)] hover:bg-white/50 transition-colors">Đã hủy</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full justify-end">
            <button
              type="button"
              onClick={() => navigate('/cancel')}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all shadow-md"
            >
              Hủy yêu cầu
            </button>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
              <input 
                className="bg-white border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] rounded-2xl pl-12 pr-4 py-3 w-full md:w-72 outline-none font-semibold transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]" 
                placeholder="Tìm mã yêu cầu..." 
                type="text"
              />
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {historyData.map((item, idx) => (
            <div key={idx} className="card p-6 border border-transparent hover:border-[var(--primary)]/20 hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${item.status === 'Đã hủy' ? 'bg-slate-100 text-slate-400' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-[var(--text-muted)] tracking-widest uppercase">{item.id}</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[var(--text-main)]">{item.title}</h3>
                    <p className="text-sm text-[var(--text-sub)] font-medium mt-1">{item.time} • {item.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 lg:gap-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Nhân viên</span>
                    {item.technician ? (
                      <div className="flex items-center gap-2">
                        <img src={item.techImg} alt="tech" className="w-6 h-6 rounded-full border border-[var(--border)] shadow-sm" />
                        <span className="font-bold text-sm text-[var(--text-main)]">{item.technician}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm text-slate-400">Không có</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Chi phí</span>
                    <span className="font-black text-[var(--primary)]">{item.cost}</span>
                  </div>
                  <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
                    {item.status === 'Hoàn thành' ? (
                      item.hasRating ? (
                        <div className="flex items-center bg-[var(--accent)] px-4 py-2.5 rounded-full text-amber-900 font-black text-xs shadow-sm">
                          <Star size={14} fill="currentColor" className="mr-1" />
                          {item.rating}
                        </div>
                      ) : (
                        <button className="btn btn-primary px-6 py-2.5 rounded-full text-xs shadow-md active:scale-95">
                          Đánh giá
                        </button>
                      )
                    ) : (
                      <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-full text-xs font-black uppercase hover:bg-slate-200 transition-all">
                        Chi tiết hủy
                      </button>
                    )}
                    <button className="p-2 hover:bg-[var(--primary)]/5 text-[var(--text-muted)] hover:text-[var(--primary)] rounded-full transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Xem thêm lịch sử</span>
            <ChevronsDown className="text-[var(--primary)] animate-bounce" size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default RescueHistory;