import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    setUpdatingId(id);
    const res = await updateQuantity(id, newQty);
    setUpdatingId(null);
    
    if (!res.success) {
      setToast({ type: 'error', message: res.message });
    }
  };

  const handleRemove = async (id) => {
    const res = await removeFromCart(id);
    if (res.success) {
      setToast({ type: 'success', message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500 animate-pulse">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng</h1>
          <p className="text-gray-500">Xem lại các sản phẩm trước khi thanh toán</p>
        </div>
        <EmptyState 
          title="Giỏ hàng của bạn đang trống" 
          message="Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!" 
          actionText="Tiếp tục mua sắm" 
          actionLink="/products" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng ({cartItems.length})</h1>
        </div>
        <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors text-sm">
          Tiếp tục chọn đồ <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Số tiền</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center transition-all ${updatingId === item.id ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img 
                        src={item.productImageUrl || 'https://via.placeholder.com/200x200?text=No+Image'} 
                        alt={item.productName} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                        <Link to={`/products/${item.productId}`} className="hover:text-blue-600 transition-colors">
                          {item.productName}
                        </Link>
                      </h3>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa
                      </button>
                    </div>
                  </div>

                  <div className="col-span-4 sm:col-span-2 text-center">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</span>
                  </div>

                  <div className="col-span-4 sm:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-md transition-all disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-md transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-4 sm:col-span-2 text-right">
                    <span className="text-sm font-bold text-red-600">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tổng thanh toán</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tạm tính</span>
                <span className="text-gray-900 font-medium">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium italic">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(getCartTotal())}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Mua hàng ngay <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
