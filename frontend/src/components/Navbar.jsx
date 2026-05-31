import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Package, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ripple effect handler
  const createRipple = useCallback((e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(59, 130, 246, 0.25);
      border-radius: 50%;
      transform: scale(0);
      animation: navRipple 0.55s ease-out forwards;
      pointer-events: none;
      z-index: 0;
    `;
    button.style.overflow = 'hidden';
    button.style.position = 'relative';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleNavLinkClick = (e, path) => {
    if (path === '/products' && !isAuthenticated) {
      e.preventDefault();
      const confirmLogin = window.confirm("Bạn phải đăng nhập?");
      if (confirmLogin) {
        navigate('/login');
      }
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Shop', path: '/products' },
  ];

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:rotate-12 transition-transform duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              E-<span className="text-blue-600">SHOP</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActiveLink(link.path);
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={(e) => { createRipple(e); handleNavLinkClick(e, link.path); }}
                  className={`nav-link-item relative text-sm font-bold uppercase tracking-widest transition-all duration-300 select-none
                    ${active 
                      ? 'text-blue-500 nav-link-active' 
                      : 'text-gray-400 hover:text-blue-400 hover:scale-105'}
                  `}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Active underline */}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
            {isAdmin && (
              <Link 
                to="/admin"
                onClick={createRipple}
                className={`nav-link-item relative flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 select-none
                  ${isActiveLink('/admin') 
                    ? 'text-blue-500 nav-link-active' 
                    : 'text-blue-400 hover:text-blue-300 hover:scale-105'}
                `}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="relative z-10">Trang quản trị</span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-300 ${isActiveLink('/admin') ? 'w-full' : 'w-0'}`} />
              </Link>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full transition-all group">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold text-gray-700 truncate max-w-[100px]">
                    {user?.firstName}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tài khoản</p>
                      <p className="text-sm font-black text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className="p-2">
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Trang quản trị
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4" /> Thông tin cá nhân
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4" /> Lịch sử đơn hàng
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-widest"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-1 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => {
            const active = isActiveLink(link.path);
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`mobile-nav-item flex items-center gap-3 px-4 py-3 text-base font-bold rounded-xl transition-all duration-200 relative overflow-hidden
                  ${active 
                    ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' 
                    : 'text-gray-400 hover:bg-slate-800 hover:text-blue-400'}
                `}
                onClick={(e) => {
                  createRipple(e);
                  setIsMenuOpen(false);
                  handleNavLinkClick(e, link.path);
                }}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />}
                {link.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`mobile-nav-item flex items-center gap-3 px-4 py-3 text-base font-bold rounded-xl transition-all duration-200 relative overflow-hidden
                ${isActiveLink('/admin')
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-blue-400 hover:bg-blue-600/10'}
              `}
              onClick={(e) => { createRipple(e); setIsMenuOpen(false); }}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              Trang quản trị
            </Link>
          )}
          {!isAuthenticated && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link 
                to="/login" 
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
