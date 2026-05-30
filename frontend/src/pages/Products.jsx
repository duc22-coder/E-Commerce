import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, X, Sparkles, CheckCircle2, Archive, DollarSign } from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState('Tất cả');
  const [onlyInStock, setOnlyInStock] = useState(false);
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

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || product.category?.name === selectedCategory;
    const matchesBrand = selectedBrand === 'Tất cả' || product.brand === selectedBrand;
    
    // Convert to actual display price using the formatCurrency logic to filter accurately
    const dbPrice = product.price || 0;
    const actualPrice = dbPrice < 100000 ? dbPrice * 1000 : dbPrice;

    let matchesPrice = true;
    if (priceRange === 'under-100') {
      matchesPrice = actualPrice < 100000;
    } else if (priceRange === '100-500') {
      matchesPrice = actualPrice >= 100000 && actualPrice <= 500000;
    } else if (priceRange === '500-2000') {
      matchesPrice = actualPrice >= 500000 && actualPrice <= 2000000;
    } else if (priceRange === 'over-2000') {
      matchesPrice = actualPrice > 2000000;
    }
    
    const matchesStock = !onlyInStock || product.stockQuantity > 0;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Default newest (based on natural DB order here)
  });

  // Extract Categories and Brands dynamically
  const categories = ['Tất cả', ...new Set(products.map(p => p.category?.name).filter(Boolean))];
  const brands = ['Tất cả', ...new Set(products.map(p => p.brand).filter(Boolean))];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSelectedBrand('Tất cả');
    setPriceRange('Tất cả');
    setOnlyInStock(false);
    setSortBy('newest');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-blue-200 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3 fill-current" /> Bộ sưu tập độc quyền
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Khám phá Cửa hàng
          </h1>
          <p className="text-blue-100/80 text-sm md:text-base font-medium">
            Tận hưởng ưu đãi tốt nhất với danh sách sản phẩm chất lượng cao, đa dạng lựa chọn phù hợp cho mọi cá tính.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters on Left, Products on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
              <h2 className="font-black text-gray-900 flex items-center gap-2 text-base">
                <Filter className="w-4 h-4 text-blue-600" /> Bộ lọc tìm kiếm
              </h2>
              {(searchTerm || selectedCategory !== 'Tất cả' || selectedBrand !== 'Tất cả' || priceRange !== 'Tất cả' || onlyInStock || sortBy !== 'newest') && (
                <button 
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-0.5"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* 1. Search Box */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Tìm kiếm</label>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Category Filter (Premium list list layout) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Danh mục</label>
              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Brand Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Thương hiệu</label>
              <div className="relative">
                <select 
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-2xl pl-4 pr-10 py-3 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 4. Price Bracket Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Khoảng giá</label>
              <div className="space-y-1">
                {[
                  { value: 'Tất cả', label: 'Tất cả mức giá' },
                  { value: 'under-100', label: 'Dưới 100.000 ₫' },
                  { value: '100-500', label: '100.000 ₫ - 500.000 ₫' },
                  { value: '500-2000', label: '500.000 ₫ - 2.000.000 ₫' },
                  { value: 'over-2000', label: 'Trên 2.000.000 ₫' }
                ].map((bracket) => (
                  <button
                    key={bracket.value}
                    onClick={() => setPriceRange(bracket.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      priceRange === bracket.value 
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{bracket.label}</span>
                    {priceRange === bracket.value && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. In Stock Toggle */}
            <div className="pt-2 border-t border-gray-50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="h-4.5 w-4.5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
                  Chỉ hiện sản phẩm còn hàng
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Right Column: Grid and Toolbar */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Summary Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-bold text-gray-500 px-2">
              Hiển thị <span className="text-gray-900 font-black">{sortedProducts.length}</span> sản phẩm kết quả
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sắp xếp</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-w-[160px]"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                </select>
                <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid / Loading / Empty state */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-3xl border border-gray-100 space-y-4">
                  <div className="bg-gray-100 aspect-square rounded-2xl"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Archive className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-gray-500 text-xs font-bold max-w-sm mx-auto mb-6">Thử thay đổi từ khóa hoặc bộ lọc khoảng giá và danh mục khác.</p>
              <button 
                onClick={handleClearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Products;
