import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-2xl tracking-tight text-dark flex items-center">
            <span className="w-8 h-8 bg-gray-900 text-white rounded flex items-center justify-center mr-2 text-xl">E</span>
            COMMERCE
          </Link>
          <Navbar />
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      <footer className="bg-dark text-white pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="font-extrabold text-2xl tracking-tight text-white mb-4 block">E-COMMERCE</span>
              <p className="text-gray-400 max-w-sm">
                Your one-stop destination for premium products. Quality, style, and exceptional service.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Shop All</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <span className="cursor-pointer hover:text-white">Facebook</span>
              <span className="cursor-pointer hover:text-white">Twitter</span>
              <span className="cursor-pointer hover:text-white">Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
