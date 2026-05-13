import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  LogOut, 
  History, 
  HelpCircle, 
  ChevronDown,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dịch vụ', path: '/detail' },
    { name: 'Yêu cầu', path: '/request' },
    { name: 'Lịch sử', path: '/history' },
    { name: 'Ước tính phí', path: '/estimation' },
    { name: 'Hỗ trợ', path: '/support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/detail" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className={`font-black text-2xl tracking-tight transition-colors ${
            isScrolled ? 'text-[var(--primary)]' : 'text-[var(--primary)]'
          }`}>
            RescueGuard
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-black uppercase tracking-widest transition-all hover:text-[var(--primary)] ${
                location.pathname === link.path 
                  ? 'text-[var(--primary)] relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-[var(--primary)]' 
                  : 'text-[var(--text-sub)]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="p-2.5 text-[var(--text-sub)] hover:bg-[var(--primary)]/5 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-white border border-[var(--border)] rounded-full hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-sm font-bold text-[var(--text-main)]">
                {user?.email?.split('@')[0] || 'Khách'}
              </span>
              <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-[var(--border)] rounded-2xl shadow-xl py-2 animate-fade-in">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-sub)] hover:bg-[var(--bg-body)] hover:text-[var(--primary)] transition-colors">
                  <User size={18} /> Hồ sơ cá nhân
                </Link>
                <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-sub)] hover:bg-[var(--bg-body)] hover:text-[var(--primary)] transition-colors">
                  <History size={18} /> Lịch sử cứu hộ
                </Link>
                <div className="h-px bg-[var(--border)] my-1 mx-4"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-[var(--text-main)] hover:bg-[var(--bg-body)] rounded-xl transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-[var(--border)] shadow-xl animate-fade-in overflow-hidden">
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 text-base font-black uppercase tracking-widest ${
                  location.pathname === link.path ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-[var(--border)] my-2"></div>
            <Link to="/profile" className="flex items-center gap-3 py-3 font-bold text-[var(--text-main)]">
              <User size={20} /> Hồ sơ cá nhân
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-3 font-bold text-red-500"
            >
              <LogOut size={20} /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
