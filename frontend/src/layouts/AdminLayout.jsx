import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Users, Tag, Grid, LayoutDashboard, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Ripple effect for sidebar nav items
  const createSidebarRipple = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
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
      background: rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: adminRipple 0.5s ease-out forwards;
      pointer-events: none;
      z-index: 0;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Orders', path: '/admin/orders', icon: Grid },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col hidden md:flex flex-shrink-0 shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="font-extrabold text-xl tracking-tight text-white flex items-center">
            <span className="w-6 h-6 bg-primary-600 text-white rounded flex items-center justify-center mr-2 text-sm">E</span>
            ADMIN
          </Link>
        </div>
        <nav className="flex-grow py-6 px-3 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={createSidebarRipple}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`admin-nav-link admin-nav-animate flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative overflow-hidden ${
                  active 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]' 
                    : 'text-gray-300 hover:bg-gray-700/60 hover:text-white hover:translate-x-1'
                }`}
              >
                {/* Active left accent bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/60 rounded-r-full" />
                )}
                <Icon className={`mr-3 flex-shrink-0 h-5 w-5 transition-transform duration-200 ${active ? 'text-white scale-110' : 'text-gray-400 group-hover:scale-110'}`} />
                <span className="relative z-10">{item.name}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={(e) => { createSidebarRipple(e); logout(); }}
            className="admin-nav-link flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition-all duration-200 relative overflow-hidden group"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-200">
          <div className="md:hidden font-bold text-lg text-gray-900">Admin Panel</div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {user?.username || 'Admin'}
            </span>
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
              View Store
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
