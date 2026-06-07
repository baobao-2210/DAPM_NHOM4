import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../auth/AuthContext';
import {
  Truck, Phone, Shield, Clock, Star, ArrowRight, CheckCircle, MapPin, Zap,
  UserPlus, ListChecks, MapPinned, Hourglass, Quote
} from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Khách hàng phục vụ' },
  { value: '98%', label: 'Hài lòng' },
  { value: '24/7', label: 'Hỗ trợ liên tục' },
  { value: '< 30 phút', label: 'Thời gian đến nơi' },
];

const features = [
  { icon: Clock, title: 'Phản hồi nhanh', desc: 'Đội ngũ sẵn sàng 24/7, đến nơi trong vòng 30 phút', bg: 'bg-[#EFF6FF]', iconColor: 'text-[#1D4ED8]' },
  { icon: Shield, title: 'Chuyên nghiệp', desc: 'Kỹ thuật viên được đào tạo bài bản, thiết bị hiện đại', bg: 'bg-[#FEF9C3]', iconColor: 'text-[#F59E0B]' },
  { icon: MapPin, title: 'Theo dõi thực tế', desc: 'GPS tracking chính xác, biết vị trí nhân viên mọi lúc', bg: 'bg-[#F0FDF4]', iconColor: 'text-[#22C55E]' },
  { icon: Zap, title: 'Đặt dịch vụ dễ dàng', desc: 'Chỉ vài bước đơn giản để đặt dịch vụ cứu hộ', bg: 'bg-[#EFF6FF]', iconColor: 'text-[#1D4ED8]' },
];

const mockServicesFallback = [
  { icon: '🔧', name: 'Kéo xe khẩn cấp', description: 'Kéo xe đến gara gần nhất hoặc địa điểm bạn chỉ định', price: 250000, category: 'Khẩn cấp' },
  { icon: '🔋', name: 'Cứu bình', description: 'Kích bình ắc quy hoặc thay bình tại chỗ', price: 150000, category: 'Điện' },
  { icon: '🛞', name: 'Thay lốp', description: 'Thay lốp dự phòng hoặc vá lốp tại chỗ', price: 100000, category: 'Cơ khí' },
  { icon: '⛽', name: 'Tiếp xăng', description: 'Tiếp nhiên liệu khẩn cấp khi hết xăng giữa đường', price: 80000, category: 'Khẩn cấp' },
  { icon: '🔑', name: 'Mở khóa xe', description: 'Hỗ trợ khi bạn bị khóa chìa trong xe', price: 200000, category: 'Khẩn cấp' },
  { icon: '🚗', name: 'Sửa xe tại chỗ', description: 'Sửa chữa cơ bản tại chỗ, không cần kéo xe', price: 300000, category: 'Cơ khí' },
];

const howItWorks = [
  { step: 1, icon: UserPlus, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí chỉ trong 30 giây' },
  { step: 2, icon: ListChecks, title: 'Chọn dịch vụ', desc: 'Chọn dịch vụ cứu hộ phù hợp với sự cố của bạn' },
  { step: 3, icon: MapPinned, title: 'Xác nhận vị trí', desc: 'GPS tự động xác định vị trí hoặc bạn chọn trên bản đồ' },
  { step: 4, icon: Hourglass, title: 'Đợi cứu hộ', desc: 'Đội ngũ kỹ thuật viên gần nhất sẽ có mặt trong 30 phút' },
];

const testimonials = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Tài xế công nghệ',
    quote: 'Xe tôi bị hỏng lúc 2h sáng giữa đường vắng. Gọi RescueCar, chỉ 20 phút là có người đến. Giá cả rõ ràng, không phát sinh. Rất hài lòng!',
    rating: 5,
  },
  {
    name: 'Trần Thị Hương',
    role: 'Nhân viên văn phòng',
    quote: 'Lần đầu dùng dịch vụ kéo xe. Nhân viên rất lịch sự và chuyên nghiệp. App dễ sử dụng, theo dõi được vị trí xe cứu hộ. Sẽ giới thiệu cho bạn bè.',
    rating: 5,
  },
  {
    name: 'Phạm Đức Anh',
    role: 'Chủ doanh nghiệp',
    quote: 'Đã sử dụng RescueCar nhiều lần cho cả đội xe công ty. Dịch vụ ổn định, đáng tin cậy. Đặc biệt thích tính năng theo dõi GPS thời gian thực.',
    rating: 4,
  },
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

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);

  useEffect(() => {
    axiosClient.get('/DichVu')
      .then(res => setServices((res.data?.data || res.data).slice(0, 6)))
      .catch(() => setServices(mockServicesFallback));
  }, []);

  const handleRescue = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/customer/rescue-requests/create');
    }
  };

  return (
    <div className="bg-[#F8FAFC]">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image + overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1D4ED8]/90 to-[#1D4ED8]/80" />

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-6 py-24 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* LEFT: Copy */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#FBBF24] text-sm font-semibold mb-8">
                <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse" />
                Phục vụ 24/7 trên toàn quốc
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Cứu hộ xe
                <span className="block text-[#FBBF24]">
                  Nhanh, An toàn,
                </span>
                <span className="block text-white/90 text-4xl lg:text-5xl mt-2">
                  Chuyên nghiệp
                </span>
              </h1>

              <p className="text-xl text-white/75 leading-relaxed mb-10 max-w-xl">
                Gặp sự cố xe giữa đường? Đừng lo! RescueCar có mặt trong vòng{' '}
                <strong className="text-white">30 phút</strong>.
                Dịch vụ chuyên nghiệp, giá cả minh bạch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleRescue}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#FBBF24] text-[#0F172A] font-bold rounded-xl hover:bg-[#F59E0B] transition-all duration-300 shadow-2xl shadow-[#FBBF24]/30 hover:shadow-[#FBBF24]/50 hover:-translate-y-0.5 text-lg"
                >
                  <Truck className="w-6 h-6 group-hover:animate-bounce" />
                  Yêu cầu cứu hộ ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="tel:19001234"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300 text-lg"
                >
                  <Phone className="w-5 h-5 text-[#FBBF24]" />
                  Gọi 1900 1234
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 mt-10 justify-center lg:justify-start">
                {['An toàn 100%', 'Giá công khai', 'Bảo hành 30 ngày'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#FBBF24]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Floating stats card */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-80">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8] flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] text-lg">RescueCar</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                        <span className="text-[#22C55E] text-xs font-medium">Đang hoạt động</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {stats.map(({ value, label }) => (
                      <div key={label} className="text-center p-4 rounded-2xl bg-[#EFF6FF]">
                        <div className="text-2xl font-extrabold text-[#1D4ED8]">{value}</div>
                        <div className="text-[#64748B] text-xs mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                      <span className="font-bold text-[#0F172A]">4.9 / 5</span>
                    </div>
                    <span className="text-[#64748B] text-sm">10,000+ đánh giá</span>
                  </div>
                </div>

                {/* Floating mini card */}
                <div className="absolute -top-4 -right-4 bg-[#1D4ED8] text-white rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-[#FBBF24] text-xs font-bold">⚡ Nhanh nhất</p>
                  <p className="text-white text-sm font-semibold">15 phút đến nơi</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold text-[#1D4ED8] mb-1">{value}</div>
                <div className="text-[#64748B] text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Tại sao chọn chúng tôi
            </div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Tại sao chọn RescueCar?</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Chúng tôi luôn đặt sự an toàn và sự hài lòng của bạn lên hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-[#0F172A] font-semibold text-lg mb-2">{title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-sm font-semibold mb-4">
              <ListChecks className="w-4 h-4" />
              Quy trình đơn giản
            </div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Cách thức hoạt động</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Chỉ 4 bước đơn giản để được hỗ trợ cứu hộ nhanh chóng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-[#E2E8F0]" />

            {howItWorks.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {/* Step number circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-[#1D4ED8] flex items-center justify-center mb-6 shadow-lg shadow-[#1D4ED8]/20">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {/* Step number badge */}
                <div className="absolute top-0 right-1/2 translate-x-8 -translate-y-1 w-6 h-6 rounded-full bg-[#FBBF24] text-[#0F172A] text-xs font-bold flex items-center justify-center z-20 shadow">
                  {step}
                </div>
                <h3 className="text-[#0F172A] font-semibold text-lg mb-2">{title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="py-20 bg-[#EFF6FF]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#1D4ED8] text-sm font-semibold mb-4 shadow-sm">
              <Zap className="w-4 h-4" />
              Dịch vụ của chúng tôi
            </div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Dịch vụ cứu hộ toàn diện</h2>
            <p className="text-[#64748B] text-lg">Đầy đủ các dịch vụ cứu hộ và hỗ trợ xe</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ _id, name, description, price, category }) => (
              <div key={_id || name} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group overflow-hidden relative text-left">
                {/* Image Cover */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={getServiceImage(name)} 
                    alt={name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://placehold.co/600x400/1D4ED8/FFFFFF/png?text=RescueCar';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent transition-opacity duration-300" />
                  
                  {category && (
                    <span className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#1D4ED8] text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                      {category}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {description}
                  </p>
                  
                  <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[#94A3B8] text-[10px] uppercase tracking-wider font-extrabold mb-1">Giá tham khảo</p>
                      <p className="text-[#F59E0B] font-black text-2xl drop-shadow-sm">
                        {price ? `${price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
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

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold rounded-xl hover:bg-[#1D4ED8] hover:text-white transition-all duration-300 shadow-sm"
            >
              Xem tất cả dịch vụ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              Đánh giá từ khách hàng
            </div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Khách hàng nói gì về chúng tôi?</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của RescueCar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }) => (
              <div
                key={name}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-[#1D4ED8]/20 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating
                          ? 'text-[#FBBF24] fill-[#FBBF24]'
                          : 'text-[#E2E8F0] fill-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-[#0F172A] text-sm leading-relaxed mb-6">"{quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                    <span className="text-[#1D4ED8] font-bold text-sm">
                      {name.split(' ').pop()?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#0F172A] font-semibold text-sm">{name}</p>
                    <p className="text-[#64748B] text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-[#1D4ED8] px-8 py-16 text-center shadow-2xl shadow-[#1D4ED8]/30">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FBBF24]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
            <div className="absolute top-6 left-6 w-8 h-8 bg-[#FBBF24] rounded-full opacity-60" />
            <div className="absolute bottom-6 right-10 w-5 h-5 bg-[#FBBF24] rounded-full opacity-40" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/30 text-[#FBBF24] text-sm font-semibold mb-6">
                <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse" />
                Sẵn sàng hỗ trợ 24/7
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Cần hỗ trợ ngay?
              </h2>
              <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
                Đội ngũ của chúng tôi sẵn sàng 24/7 để hỗ trợ bạn vượt qua mọi sự cố trên đường
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRescue}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FBBF24] text-[#0F172A] font-bold rounded-xl hover:bg-[#F59E0B] transition-all duration-300 shadow-xl hover:-translate-y-0.5 text-lg"
                >
                  🚗 Yêu cầu cứu hộ ngay
                </button>
                <a
                  href="tel:19001234"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 text-lg"
                >
                  📞 Gọi 1900 1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
