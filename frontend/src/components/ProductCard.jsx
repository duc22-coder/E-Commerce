import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Toast from './Toast';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    const res = await addToCart(product.id, 1);
    if (res.success) {
      setToastMessage({ type: 'success', text: 'Added to cart!' });
    } else {
      setToastMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      {toastMessage && (
        <Toast 
          type={toastMessage.type} 
          message={toastMessage.text} 
          onClose={() => setToastMessage(null)} 
        />
      )}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-w-4 aspect-h-3">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wider">
          {product.category?.name || 'Category'}
        </div>
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center justify-center bg-gray-900 hover:bg-primary-600 text-white p-2 rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
