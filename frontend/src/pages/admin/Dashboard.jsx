import { useState, useEffect } from 'react';
import { Package, Tag, ShoppingCart, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import formatCurrency from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/orders') // Admin gets all orders
        ]);

        const products = productsRes.data.content || productsRes.data || [];
        const categories = categoriesRes.data || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((sum, order) => {
          if (order.status !== 'CANCELLED') {
            return sum + order.totalAmount;
          }
          return sum;
        }, 0);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalRevenue
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Tổng đơn hàng', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { name: 'Tổng sản phẩm', value: stats.totalProducts, icon: Package, color: 'text-orange-600 bg-orange-50' },
    { name: 'Tổng danh mục', value: stats.totalCategories, icon: Tag, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500 font-bold mt-1">Quản lý hiệu suất kinh doanh của cửa hàng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.name}</p>
                <p className="text-2xl font-black text-gray-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <th className="pb-3">Mã ĐH</th>
                  <th className="pb-3">Khách hàng</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3 text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="text-gray-700">
                      <td className="py-3.5">#{order.id}</td>
                      <td className="py-3.5">{order.userEmail}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                          order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-black text-gray-900">{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-400 font-bold">Chưa có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Trend */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-gray-900 mb-6">Tăng trưởng</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-blue-800">Tỷ lệ hoàn tất</p>
                    <p className="text-[10px] text-blue-600">Đơn thành công</p>
                  </div>
                </div>
                <span className="text-lg font-black text-blue-800">
                  {stats.totalOrders > 0 
                    ? Math.round((recentOrders.filter(o => o.status === 'COMPLETED').length / recentOrders.length) * 100) || 100
                    : 100}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-6 text-center text-xs text-gray-400 font-bold">
            Hệ thống quản trị E-SHOP v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
