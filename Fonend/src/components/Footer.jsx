import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, MessageCircle, Share2 } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#0F172A] text-white mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">RescueCar</span>
          </Link>
          <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
            Giải pháp cứu hộ xe thông minh, nhanh chóng và an toàn. Đồng hành cùng bạn trên mọi nẻo đường với đội ngũ chuyên nghiệp 24/7.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Dịch vụ cứu hộ</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Bảng giá</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li className="hover:text-white transition-colors cursor-pointer">Kéo xe khẩn cấp</li>
            <li className="hover:text-white transition-colors cursor-pointer">Kích bình ắc quy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Thay lốp dự phòng</li>
            <li className="hover:text-white transition-colors cursor-pointer">Tiếp nhiên liệu</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#FBBF24] flex-shrink-0 mt-0.5" />
              <span>123 Đường ABC, Quận X, TP.HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#FBBF24] flex-shrink-0" />
              <a href="tel:19001234" className="hover:text-white transition-colors">1900 1234</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#FBBF24] flex-shrink-0" />
              <a href="mailto:support@rescuecar.vn" className="hover:text-white transition-colors">support@rescuecar.vn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-[#94A3B8]">
        <p>&copy; 2024 RescueCar. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
