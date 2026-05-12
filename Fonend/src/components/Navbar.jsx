import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#edeef0]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo - Bấm vào sẽ về trang chủ */}
        <Link to="/" className="text-2xl font-black tracking-tight text-[#003fb1] font-['Manrope']">
          RescueGuard
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center flex-wrap gap-6 font-['Manrope'] font-bold text-lg">
          <Link to="/detail" className="text-[#003fb1] border-b-2 border-[#003fb1] pb-1">
            Dịch vụ
          </Link>
          <Link to="/request" className="text-[#737686] hover:text-[#003fb1] transition-colors">
            Yêu cầu
          </Link>
          <Link to="/history" className="text-[#737686] hover:text-[#003fb1] transition-colors">
            Lịch sử
          </Link>
          <Link to="/support" className="text-[#737686] hover:text-[#003fb1] transition-colors">
            Hỗ trợ
          </Link>
          <Link to="/profile" className="text-[#737686] hover:text-[#003fb1] transition-colors">
            Hồ sơ
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <button className="material-symbols-outlined p-2 text-[#434654] hover:bg-slate-50 rounded-full transition-colors active:scale-90">
            notifications
          </button>
          <Link to="/profile" className="material-symbols-outlined p-2 text-[#434654] hover:bg-slate-50 rounded-full transition-colors active:scale-90 inline-flex items-center justify-center">
            account_circle
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;