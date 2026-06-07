import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import { Wrench, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';

// Giữ lại mock data cho fallback
const mockServices = [
  { _id: '1', icon: '🔧', name: 'Kéo xe khẩn cấp', description: 'Kéo xe đến gara gần nhất hoặc địa điểm bạn chỉ định an toàn.', price: 250000, category: 'Khẩn cấp' },
  { _id: '2', icon: '🔋', name: 'Kích bình ắc quy', description: 'Kích bình ắc quy hoặc thay bình mới tại chỗ nhanh chóng.', price: 150000, category: 'Điện' },
  { _id: '3', icon: '🛞', name: 'Thay lốp dự phòng', description: 'Thay lốp dự phòng hoặc vá lốp tại chỗ cho các sự cố thủng xăm.', price: 100000, category: 'Cơ khí' },
  { _id: '4', icon: '⛽', name: 'Tiếp nhiên liệu', description: 'Tiếp nhiên liệu khẩn cấp (xăng/dầu) khi xe bạn cạn kiệt giữa đường.', price: 80000, category: 'Khẩn cấp' },
  { _id: '5', icon: '🔑', name: 'Mở khóa xe', description: 'Hỗ trợ mở khóa an toàn khi bạn vô tình để quên chìa khóa trong xe.', price: 200000, category: 'Khẩn cấp' },
  { _id: '6', icon: '🚗', name: 'Sửa xe tại chỗ', description: 'Khắc phục các sự cố cơ bản tại chỗ để bạn tiếp tục hành trình.', price: 300000, category: 'Cơ khí' },
];

const getServiceImage = (name) => {
  const n = name.toLowerCase();
  if (n.includes('kích bình') && n.includes('xe máy')) return '/images/services/service_kich_binh_xe_may.png';
  if (n.includes('kích bình') && n.includes('ô tô')) return '/images/services/service_kich_binh_oto.png';
  if (n.includes('kích bình')) return '/images/services/service_kich_binh_oto.png';
  if (n.includes('vá lốp')) return '/images/services/service_va_lop_xe_may.png';
  if (n.includes('kéo xe') && n.includes('ô tô')) return '/images/services/service_keo_xe_oto.png';
  if (n.includes('kéo xe') && n.includes('tải')) return '/images/services/service_keo_xe_tai.png';
  if (n.includes('kéo xe')) return '/images/services/service_keo_xe_oto.png';
  if (n.includes('thay khóa') || n.includes('mở khóa')) return '/images/services/service_mo_khoa_oto.png';
  if (n.includes('tiếp nhiên liệu')) return '/images/services/service_tiep_nhien_lieu.png';
  if (n.includes('thay lốp')) return '/images/services/service_thay_lop_oto.png';
  if (n.includes('sửa xe') || n.includes('cơ khí')) return '/images/services/service_sua_xe_tai_cho.png';
  return '/images/services/service_sua_xe_tai_cho.png'; // default
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    axiosClient.get('/DichVu')
      .then(res => setServices(res.data?.data || res.data || mockServices))
      .catch(() => setServices(mockServices))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))];
  const filteredServices = filter === 'All' ? services : services.filter(s => s.category === filter);

  const handleRescue = () => {
    if (!user) navigate('/login', { state: { from: { pathname: '/customer/rescue-requests/create' } } });
    else navigate('/customer/rescue-requests/create');
  };

  // Build tabs array for the Tabs component
  const tabItems = categories.map(c => ({
    value: c,
    label: c === 'All' ? 'Tất cả dịch vụ' : c,
    count: c === 'All' ? services.length : services.filter(s => s.category === c).length,
  }));

  if (loading) return <Loading />;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] py-24 px-6 text-center text-white relative overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FBBF24]/20 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            Dịch vụ Cứu Hộ <span className="text-[#FBBF24]">Chuyên Nghiệp</span>
          </h1>
          <p className="text-lg md:text-xl text-[#EFF6FF] opacity-95 max-w-2xl mx-auto drop-shadow">
            Giải pháp toàn diện cho mọi sự cố trên đường. Tốc độ, minh bạch và tận tâm với hình ảnh dịch vụ rõ ràng, chân thực nhất.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1280px] mx-auto px-6 py-20 relative -mt-8">
        {/* Filters using Tabs */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-12 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-fit mx-auto relative z-20">
            <Tabs
              tabs={tabItems}
              activeTab={filter}
              onChange={(val) => setFilter(val)}
            />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredServices.map(s => (
            <div key={s._id || s.name} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group overflow-hidden relative">
              {/* Image Cover */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img 
                  src={getServiceImage(s.name)} 
                  alt={s.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/600x400/1D4ED8/FFFFFF/png?text=RescueCar';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent transition-opacity duration-300" />
                
                {s.category && (
                  <span className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#1D4ED8] text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                    {s.category}
                  </span>
                )}
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{s.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {s.description}
                </p>
                
                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-[10px] uppercase tracking-wider font-extrabold mb-1">Giá tham khảo</p>
                    <p className="text-[#F59E0B] font-black text-2xl drop-shadow-sm">
                      {s.price ? `${s.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                    </p>
                  </div>
                  <button
                    onClick={handleRescue}
                    className="w-14 h-14 bg-gradient-to-br from-[#1D4ED8] to-[#2563EB] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-24 bg-white rounded-3xl p-8 lg:p-14 border border-[#E2E8F0] shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="flex-1 space-y-8 relative z-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-4">Cam kết từ RescueCar</h2>
              <p className="text-slate-500">Chúng tôi luôn đặt sự an toàn và hài lòng của khách hàng lên hàng đầu trong mọi tình huống.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                'Đến nơi nhanh chóng trong vòng 30 phút',
                'Kỹ thuật viên chuyên nghiệp, giàu kinh nghiệm',
                'Thiết bị, máy móc cứu hộ chuẩn quốc tế',
                'Báo giá minh bạch trước khi làm, cam kết không phát sinh',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <span className="text-[#334155] font-semibold text-sm leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-[400px] bg-gradient-to-b from-[#F8FAFC] to-white rounded-2xl p-8 border border-[#E2E8F0] text-center shadow-sm relative z-10">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Wrench className="w-10 h-10 text-[#1D4ED8]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Bạn cần tư vấn thêm?</h3>
            <p className="text-[#64748B] mb-8 text-sm">Liên hệ ngay tổng đài trực tuyến 24/7 để được nhân viên tư vấn gói dịch vụ tối ưu nhất.</p>
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-blue-500/20"
              icon={Phone}
              onClick={() => window.location.href = 'tel:19001234'}
            >
              Gọi 1900 1234
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
