import { Shield, Clock, Award, Users, Truck, MapPin } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';

const About = () => {
  const stats = [
    { icon: Users, label: 'Khách hàng', value: '10,000+', iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#1D4ED8]' },
    { icon: Truck, label: 'Xe đã cứu hộ', value: '15,000+', iconBg: 'bg-[#F0FDF4]', iconColor: 'text-[#22C55E]' },
    { icon: Shield, label: 'Đối tác gara', value: '500+', iconBg: 'bg-[#FEF9C3]', iconColor: 'text-[#F59E0B]' },
    { icon: MapPin, label: 'Tỉnh thành', value: '63/63', iconBg: 'bg-[#FEF2F2]', iconColor: 'text-[#EF4444]' },
  ];

  const values = [
    { icon: Clock, title: 'Tốc độ', desc: 'Có mặt nhanh nhất có thể, trung bình dưới 30 phút.', iconColor: 'text-[#1D4ED8]', iconBg: 'bg-[#EFF6FF]' },
    { icon: Shield, title: 'An toàn', desc: 'Đảm bảo an toàn tuyệt đối cho người và phương tiện.', iconColor: 'text-[#22C55E]', iconBg: 'bg-[#F0FDF4]' },
    { icon: Award, title: 'Chất lượng', desc: 'Kỹ thuật viên lành nghề, thiết bị cứu hộ chuẩn quốc tế.', iconColor: 'text-[#F59E0B]', iconBg: 'bg-[#FEF9C3]' },
    { icon: Users, title: 'Tận tâm', desc: 'Phục vụ khách hàng bằng cả tấm lòng, hỗ trợ 24/7.', iconColor: 'text-[#1D4ED8]', iconBg: 'bg-[#EFF6FF]' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <section className="bg-[#1D4ED8] py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Về <span className="text-[#FBBF24]">RescueCar</span></h1>
          <p className="text-lg text-[#EFF6FF] opacity-90 leading-relaxed">
            Chúng tôi là nền tảng kết nối dịch vụ cứu hộ giao thông hàng đầu Việt Nam, mang đến sự an tâm cho mọi tài xế trên mọi nẻo đường.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1280px] mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon, label, value, iconBg, iconColor }) => (
            <StatCard
              key={label}
              icon={icon}
              title={label}
              value={value}
              iconBg={iconBg}
              iconColor={iconColor}
            />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-[#64748B] leading-relaxed text-lg">
              <p>
                Được thành lập vào năm 2024 từ một đồ án môn học, RescueCar ra đời với sứ mệnh giải quyết nỗi lo lắng của các tài xế khi gặp sự cố giữa đường vắng hoặc trong đêm tối.
              </p>
              <p>
                Thay vì phải tìm kiếm thủ công các số điện thoại cứu hộ không rõ uy tín và giá cả, nền tảng của chúng tôi kết nối bạn trực tiếp với mạng lưới kỹ thuật viên chuyên nghiệp gần nhất thông qua GPS.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-video bg-[#EFF6FF] rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex items-center justify-center">
              <span className="text-6xl">🚗💨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Giá trị cốt lõi</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">Kim chỉ nam cho mọi hoạt động và dịch vụ mà chúng tôi cung cấp</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, iconColor, iconBg }) => (
              <Card key={title} variant="interactive" className="flex flex-col">
                <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-[#0F172A] font-bold text-xl mb-3">{title}</h3>
                <p className="text-[#64748B] leading-relaxed text-sm">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
