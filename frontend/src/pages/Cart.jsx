import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    const res = await updateQuantity(id, newQty);
    if (!res.success) {
      setToast({ type: 'error', message: res.message });
    }
  };

  const handleRemove = async (id) => {
    const res = await removeFromCart(id);
    if (res.success) {
      setToast({ type: 'success', message: 'Item removed' });
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <EmptyState 
          title="Your cart is empty" 
          message="Looks like you haven't added anything to your cart yet." 
          actionText="Start Shopping" 
          actionLink="/products" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.product.id}`} className="hover:text-primary-600">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{item.product.category?.name || 'Uncategorized'}</p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1 || loading}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          disabled={item.quantity >= item.product.stock || loading}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemove(item.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors flex items-center text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Estimated Total</span>
                <span className="text-lg font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-600 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
