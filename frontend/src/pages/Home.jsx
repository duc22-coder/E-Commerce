import { useState, useEffect } from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
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
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center px-8 md:px-20">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full text-blue-200 text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/30">
              <Zap className="w-3.5 h-3.5 fill-current" /> Bộ sưu tập Mùa Hè 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
              Nâng Tầm <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Phong Cách Việt
              </span>
            </h1>
            <p className="text-base md:text-lg text-blue-100/80 mb-8 font-medium leading-relaxed">
              Khám phá những thiết kế độc bản, kết hợp tinh tế giữa sự tối giản hiện đại và chất liệu cao cấp nhất.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link 
                to="/products" 
                className="bg-white text-blue-900 font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/10 active:scale-95 flex items-center gap-2"
              >
                Mua sắm ngay <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Bar (Elegant Horizontal Ribbon) */}
      <section className="bg-white border border-gray-100 shadow-sm rounded-3xl py-6 px-8 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Vận chuyển 0đ</h4>
            <p className="text-[11px] text-gray-500">Cho mọi đơn hàng</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">100% Chính hãng</h4>
            <p className="text-[11px] text-gray-500">Cam kết chất lượng</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Đổi trả 30 ngày</h4>
            <p className="text-[11px] text-gray-500">Miễn phí dễ dàng</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Hỗ trợ 24/7</h4>
            <p className="text-[11px] text-gray-500">Tận tâm chuyên nghiệp</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Sản phẩm nổi bật</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-2"></div>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-all">
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
    </div>
  );
};

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

export default Home;
