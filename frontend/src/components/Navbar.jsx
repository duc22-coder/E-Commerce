import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex items-center space-x-6">
      <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
        Shop
      </Link>
      
      <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cartItemCount}
          </span>
        )}
      </Link>

      {isAuthenticated ? (
        <div className="relative group">
          <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium focus:outline-none">
            <User className="w-5 h-5" />
            <span>{user?.username || 'Account'}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Profile
            </Link>
            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Order History
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50 border-t border-gray-100">
                Admin Dashboard
              </Link>
            )}
            <button 
              onClick={() => logout()}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium text-sm">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
