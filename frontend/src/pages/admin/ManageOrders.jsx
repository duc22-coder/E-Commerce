import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Check, X, RefreshCw, ChevronRight, MapPin, CreditCard, Calendar } from 'lucide-react';
import api from '../../api/axios';
import formatCurrency from '../../utils/formatCurrency';
import Toast from '../../components/Toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Details Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders', error);
      setToast({ type: 'error', message: 'Không thể tải danh sách đơn hàng.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Endpoint expects: PATCH /api/orders/{id}/status?status=...
      await api.patch(`/orders/${orderId}/status?status=${newStatus}`);
      setToast({ type: 'success', message: `Đã cập nhật trạng thái đơn hàng #${orderId} thành công!` });
      
      // Update selected order details if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }

      fetchOrders();
    } catch (error) {
      console.error('Failed to update status', error);
      setToast({ type: 'error', message: 'Lỗi cập nhật trạng thái đơn hàng.' });
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Đơn hàng</h1>
        <p className="text-sm text-gray-500 font-bold mt-1">Danh sách đơn đặt hàng từ khách hàng</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <th className="py-4 px-6">Đơn hàng</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="text-gray-700 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">#{order.id}</td>
                    <td className="py-4 px-6">{order.userEmail}</td>
                    <td className="py-4 px-6 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                        order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-600' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-gray-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleOpenDetails(order)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        {order.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                              className="p-2 hover:bg-green-50 text-green-600 rounded-xl transition-all"
                              title="Xác nhận đơn"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                              title="Hủy đơn"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>
                          </>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPING')}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                            title="Bắt đầu giao"
                          >
                            <RefreshCw className="w-4.5 h-4.5" />
                          </button>
                        )}
                        {order.status === 'SHIPPING' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            className="p-2 hover:bg-green-50 text-green-600 rounded-xl transition-all"
                            title="Hoàn tất đơn"
                          >
                            <Check className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-400 font-bold">Chưa có đơn đặt hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col animate-in zoom-in duration-300">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50 mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                Chi tiết đơn hàng #{selectedOrder.id}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 flex-grow">
              {/* Status Header */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                </div>
                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-black uppercase ${
                  selectedOrder.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                  selectedOrder.status === 'SHIPPING' ? 'bg-blue-50 text-blue-600' :
                  selectedOrder.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Người mua</p>
                  <p className="font-bold text-gray-900">{selectedOrder.userEmail}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Thông tin nhận hàng</p>
                  <p className="text-gray-700 leading-relaxed font-bold flex items-start gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Products in Order */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Danh sách sản phẩm</p>
                <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                          <img src={item.productImageUrl || 'https://placehold.co/150x150'} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">{item.productName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Kích cỡ: {item.size || 'Mặc định'}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-bold text-gray-900">{formatCurrency(item.priceAtTime)} x {item.quantity}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Tổng: {formatCurrency(item.priceAtTime * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total */}
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Tổng cộng thanh toán</span>
                <span className="text-2xl font-black text-red-600">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>

              {/* Action buttons inside details modal */}
              {selectedOrder.status !== 'COMPLETED' && selectedOrder.status !== 'CANCELLED' && (
                <div className="pt-6 border-t border-gray-50 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Cập nhật trạng thái đơn hàng nhanh</p>
                  <div className="flex gap-3">
                    {selectedOrder.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                          className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-all text-xs"
                        >
                          Xác nhận
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                          className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 transition-all text-xs"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                        className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-all text-xs"
                      >
                        Bắt đầu giao hàng
                      </button>
                    )}
                    {selectedOrder.status === 'SHIPPING' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                        className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-all text-xs"
                      >
                        Hoàn tất đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
