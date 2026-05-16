import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Toast from './Toast';
import { useState } from 'react';
import formatCurrency from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product.id, 1);
    if (res.success) {
      setToastMessage({ type: 'success', text: 'Đã thêm vào giỏ hàng!' });
    } else {
      setToastMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gray-200 border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {toastMessage && (
        <Toast 
          type={toastMessage.type} 
          message={toastMessage.text} 
          onClose={() => setToastMessage(null)} 
        />
      )}
      
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/400x400?text=Sản+phẩm+cao+cấp'} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Ảnh+lỗi'; }}
        />
        
        {/* Overlays */}
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stockQuantity <= 0 ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase">
              Hết hàng
            </span>
          ) : product.stockQuantity < 10 ? (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase">
              Chỉ còn {product.stockQuantity}
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
          {product.category?.name || 'Bộ sưu tập'}
        </span>
        
        <Link to={`/products/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 h-10">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-red-600">{formatCurrency(product.price)}</span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className="w-10 h-10 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-full transition-all duration-300 flex items-center justify-center disabled:bg-gray-100 disabled:text-gray-400"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
