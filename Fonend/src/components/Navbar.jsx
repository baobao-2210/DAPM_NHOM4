import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Truck, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import NotificationDropdown from './ui/NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Dịch vụ', path: '/services' },
    { name: 'Giới thiệu', path: '/about' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-md group-hover:bg-[#1E40AF] transition-colors">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1D4ED8]">RescueCar</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-[#E2E8F0] pl-6">
              {user ? (
                <>
                  <NotificationDropdown basePath={`/${user.role?.toLowerCase()}/notifications`} />
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#1D4ED8]/20 flex items-center justify-center text-[#1D4ED8] font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-[#0F172A] leading-tight">{user.name}</p>
                      <p className="text-xs text-[#64748B] capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 overflow-hidden">
                      <div className="px-4 py-2 border-b border-[#E2E8F0] mb-1">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{user.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                      </div>
                      <Link
                        to={`/${user.role?.toLowerCase()}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Bảng điều khiển
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[#0F172A] font-semibold hover:text-[#1D4ED8] transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-[#1D4ED8] text-white font-semibold rounded-full hover:bg-[#1E40AF] transition-colors shadow-md shadow-[#1D4ED8]/20 hover:-translate-y-0.5"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user && <NotificationDropdown basePath={`/${user.role?.toLowerCase()}/notifications`} />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#0F172A] hover:text-[#1D4ED8] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav — smooth transition */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-4 py-3 rounded-xl text-[#0F172A] font-medium hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-[#E2E8F0] pt-4 mt-2">
            {user ? (
              <>
                <div className="px-4 mb-3">
                  <p className="font-semibold text-[#0F172A]">{user.name}</p>
                  <p className="text-sm text-[#64748B]">{user.email}</p>
                </div>
                <Link
                  to={`/${user.role?.toLowerCase()}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#0F172A] font-medium hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" /> Bảng điều khiển
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-3 rounded-xl border-2 border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-3 rounded-xl bg-[#1D4ED8] text-white font-semibold hover:bg-[#1E40AF] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
