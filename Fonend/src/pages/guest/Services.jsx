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
      <section className="bg-[#1D4ED8] py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Dịch vụ Cứu Hộ <span className="text-[#FBBF24]">Chuyên Nghiệp</span></h1>
          <p className="text-lg text-[#EFF6FF] opacity-90">
            Giải pháp toàn diện cho mọi sự cố trên đường. Nhanh chóng, minh bạch và tận tâm.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        {/* Filters using Tabs */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-12">
            <Tabs
              tabs={tabItems}
              activeTab={filter}
              onChange={(val) => setFilter(val)}
            />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(s => (
            <div key={s._id || s.name} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition-transform">{s.icon || '🔧'}</div>
                {s.category && (
                  <span className="px-3 py-1 bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold rounded-full border border-[#1D4ED8]/10">
                    {s.category}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{s.name}</h3>
              <p className="text-[#64748B] text-sm mb-6 flex-grow leading-relaxed">{s.description}</p>
              
              <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <p className="text-[#94A3B8] text-xs uppercase tracking-wider font-semibold mb-1">Giá từ</p>
                  <p className="text-[#FBBF24] font-bold text-xl">
                    {s.price ? `${s.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                  </p>
                </div>
                <button
                  onClick={handleRescue}
                  className="w-12 h-12 bg-[#EFF6FF] text-[#1D4ED8] rounded-2xl flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-[#0F172A]">Cam kết từ RescueCar</h2>
            <div className="space-y-4">
              {[
                'Đến nơi nhanh chóng trong vòng 30 phút',
                'Kỹ thuật viên chuyên nghiệp, nhiều năm kinh nghiệm',
                'Thiết bị, máy móc cứu hộ hiện đại',
                'Báo giá minh bạch trước khi làm, không phát sinh',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#22C55E] flex-shrink-0" />
                  <span className="text-[#0F172A] font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] text-center w-full">
            <Wrench className="w-12 h-12 text-[#1D4ED8] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Bạn cần tư vấn thêm?</h3>
            <p className="text-[#64748B] mb-6">Liên hệ ngay để được nhân viên tư vấn gói dịch vụ phù hợp nhất.</p>
            <Button
              variant="primary"
              size="lg"
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
