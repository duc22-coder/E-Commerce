import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        setProducts(data.content || data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const categories = ['Tất cả', ...new Set(products.map(p => p.category?.name).filter(Boolean))];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Filter */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest mb-3">
              Cửa hàng <ChevronRight className="w-3 h-3" /> {selectedCategory}
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tất cả sản phẩm</h1>
            <p className="text-gray-500 mt-2 font-medium">Khám phá bộ sưu tập mới nhất của chúng tôi</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-2xl pl-5 pr-10 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-2xl pl-5 pr-10 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-[2rem] mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto text-center py-20 px-8 bg-red-50 rounded-[2.5rem] border border-red-100">
          <p className="text-red-600 font-black mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
          >
            Thử lại
          </button>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 font-medium">Thử thay đổi từ khóa hoặc bộ lọc để tìm sản phẩm bạn cần.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('Tất cả'); }}
            className="mt-8 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
