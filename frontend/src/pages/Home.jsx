import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts({ size: 8 });
        setFeaturedProducts(data.content || data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center px-8 md:px-20 gap-12">
          <div className="flex-1 text-center md:text-left pt-12 md:pt-0 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full text-blue-200 text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/30">
              <Zap className="w-3.5 h-3.5 fill-current" /> Bộ sưu tập Mùa Hè 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
              Nâng Tầm <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Phong Cách</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-lg font-medium leading-relaxed">
              Khám phá những thiết kế độc bản, kết hợp tinh tế giữa sự tối giản hiện đại và chất liệu cao cấp nhất.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to="/products" 
                className="bg-white text-blue-900 font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/10 active:scale-95 flex items-center gap-2"
              >
                Mua sắm ngay <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-black py-4 px-10 rounded-2xl transition-all flex items-center gap-2">
                Xem Catalog
              </button>
            </div>
          </div>
          
          <div className="flex-1 hidden md:flex justify-center items-center relative animate-in zoom-in duration-1000">
            <div className="absolute w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl"></div>
            <ShoppingBag className="w-80 h-80 text-white/10 relative z-10 animate-bounce-subtle" />
            
            {/* Floating Badges */}
            <div className="absolute top-1/4 right-0 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl animate-float">
              <p className="text-xs font-black text-blue-200 uppercase">Ưu đãi</p>
              <p className="text-xl font-black text-white">-50% OFF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sản phẩm nổi bật</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-2"></div>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:text-blue-800 transition-all">
            Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-bold">
            Chưa có sản phẩm nào nổi bật.
          </div>
        )}
      </section>

      {/* Value Propositions */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black mb-2 text-gray-900">Vận chuyển 0đ</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Miễn phí giao hàng cho tất cả các đơn hàng trên toàn quốc.</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black mb-2 text-gray-900">100% Chính hãng</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Cam kết sản phẩm chất lượng cao, nguồn gốc rõ ràng.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black mb-2 text-gray-900">Đổi trả 30 ngày</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Hỗ trợ đổi trả miễn phí trong vòng 30 ngày kể từ khi nhận.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black mb-2 text-gray-900">Hỗ trợ 24/7</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Đội ngũ chăm sóc khách hàng luôn sẵn sàng phục vụ bạn.</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10">Đăng ký nhận ưu đãi độc quyền</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto font-medium relative z-10">
          Nhận thông tin sớm nhất về các bộ sưu tập mới và các mã giảm giá lên đến 70%.
        </p>
        <form className="max-w-md mx-auto flex gap-3 relative z-10">
          <input 
            type="email" 
            placeholder="Địa chỉ email của bạn" 
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            Gửi ngay
          </button>
        </form>
      </section>
    </div>
  );
};

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

export default Home;
