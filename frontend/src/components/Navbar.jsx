import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Package, ShoppingBag, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ripple effect
  const createRipple = useCallback((e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(99,102,241,0.2);border-radius:50%;
      transform:scale(0);animation:navRipple 0.55s ease-out forwards;
      pointer-events:none;z-index:0;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Redirect to login if not authenticated when clicking Shop
  const handleNavLinkClick = (e, path) => {
    if (path === '/products' && !isAuthenticated) {
      e.preventDefault();
      navigate('/login');
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
    <nav className="sticky top-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              E-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SHOP</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActiveLink(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => { createRipple(e); handleNavLinkClick(e, link.path); }}
                  className={`nav-link-item group relative px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden select-none
                    ${active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'}
                  `}
                >
                  {/* Hover / Active background pill */}
                  <span className={`absolute inset-0 rounded-xl transition-all duration-300
                    ${active
                      ? 'bg-white/10 border border-white/10'
                      : 'bg-transparent group-hover:bg-white/5 border border-transparent group-hover:border-white/[0.08]'}
                  `} />

                  {/* Shimmer sweep on hover */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmerSweep 0.8s ease forwards' }} />

                  <span className="relative z-10">{link.name}</span>

                  {/* Active underline dot */}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(96,165,250,0.7)]" />
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={createRipple}
                className={`nav-link-item group relative px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden select-none
                  ${isActiveLink('/admin') ? 'text-indigo-300' : 'text-indigo-400 hover:text-indigo-200'}
                `}
              >
                <span className={`absolute inset-0 rounded-xl transition-all duration-300
                  ${isActiveLink('/admin') ? 'bg-indigo-500/10 border border-indigo-500/20' : 'group-hover:bg-indigo-500/5 border border-transparent group-hover:border-indigo-500/10'}
                `} />
                <span className="relative z-10 flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Quản trị
                </span>
              </Link>
            )}
          </div>

          {/* ── Search ── */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Tìm kiếm..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchVal.trim()) {
                    navigate(`/products?search=${searchVal.trim()}`);
                    setSearchVal('');
                  }
                }}
                className="w-full rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-slate-300 placeholder-slate-600 outline-none transition-all duration-200
                  bg-white/[0.05] border border-white/[0.07]
                  focus:bg-white/[0.08] focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.07] transition-all duration-200 group"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 group-hover:scale-110 transition-transform">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              /* ── Profile Dropdown ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/[0.07] transition-all duration-200 border border-transparent hover:border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/30">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold text-slate-300 truncate max-w-[90px]">
                    {user?.firstName}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)' }}>
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tài khoản</p>
                      <p className="text-sm font-black text-white mt-0.5 truncate">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                          <LayoutDashboard className="w-4 h-4" /> Trang quản trị
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-xl transition-all">
                        <User className="w-4 h-4" /> Thông tin cá nhân
                      </Link>
                      <Link to="/orders" onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-xl transition-all">
                        <Package className="w-4 h-4" /> Lịch sử đơn hàng
                      </Link>
                      <div className="my-1 border-t border-white/[0.06]" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Login Button (pre-login, main CTA) ── */
              <Link
                to="/login"
                className="login-glow-btn relative group flex items-center gap-1.5 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.12em] text-white overflow-hidden transition-all duration-300 active:scale-95 select-none"
              >
                {/* Gradient base */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500" />
                {/* Glow halo */}
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 20px 4px rgba(99,102,241,0.45)' }} />
                {/* Shine sweep */}
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%)', animation: 'shimmerSweep 0.7s ease forwards' }} />
                <Sparkles className="relative z-10 w-3 h-3 opacity-80" />
                <span className="relative z-10">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] rounded-xl transition-all"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] p-3 space-y-1 animate-in slide-in-from-top duration-200"
          style={{ background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(24px)' }}>
          {navLinks.map((link) => {
            const active = isActiveLink(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`mobile-nav-item flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 relative overflow-hidden
                  ${active
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white border border-transparent'}
                `}
                onClick={(e) => { createRipple(e); setIsMenuOpen(false); handleNavLinkClick(e, link.path); }}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />}
                {link.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className="mobile-nav-item flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20"
              onClick={(e) => { createRipple(e); setIsMenuOpen(false); }}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              Trang quản trị
            </Link>
          )}
          {!isAuthenticated && (
            <div className="pt-2 mt-1 border-t border-white/[0.06]">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 transition-transform shadow-lg shadow-indigo-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
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
