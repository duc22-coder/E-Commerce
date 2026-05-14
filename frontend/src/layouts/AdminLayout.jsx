import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Users, Tag, Grid, LayoutDashboard, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
            Logout
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
