import { useState, useEffect } from 'react';
import api from '../api/axios';
import formatCurrency from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Calendar, Tag, ChevronRight, ShoppingBag, Clock, CheckCircle, Truck, XCircle, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        // Backend returns list of orders directly or in a content field
        setOrders(response.data.content || response.data || []);
      } catch (err) {
        setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" />, label: 'Chờ xử lý' };
      case 'CONFIRMED':
        return { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Đã xác nhận' };
      case 'SHIPPING':
        return { color: 'bg-purple-100 text-purple-700', icon: <Truck className="w-4 h-4" />, label: 'Đang giao hàng' };
      case 'COMPLETED':
        return { color: 'bg-green-100 text-green-700', icon: <Box className="w-4 h-4" />, label: 'Đã hoàn thành' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" />, label: 'Đã hủy' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: <Tag className="w-4 h-4" />, label: status };
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <p className="text-gray-800 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-gray-900 text-white px-6 py-2 rounded-xl">Thử lại</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h1>
        <p className="text-gray-500 mb-8">Hãy chọn những món đồ ưng ý và lấp đầy lịch sử mua sắm của bạn!</p>
        <Link to="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Lịch sử đơn hàng</h1>
        <p className="text-gray-500 mt-2">Theo dõi và quản lý các đơn hàng bạn đã đặt</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const config = getStatusConfig(order.status);
          const date = new Date(order.createdAt || order.orderDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return (
            <div key={order.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
                      <span className="text-sm font-black text-gray-900">#{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{date}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm ${config.color}`}>
                    {config.icon}
                    {config.label}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {/* Order Items Preview */}
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.productImageUrl || 'https://via.placeholder.com/100'} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400 font-medium">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(item.priceAtTime || item.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-red-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all">
                      Chi tiết đơn
                    </button>
                    {order.status === 'COMPLETED' && (
                      <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10">
                        Mua lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
