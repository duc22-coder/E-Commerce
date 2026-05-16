import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ChevronLeft, ShieldCheck, Truck, RotateCcw, Minus, Plus, Heart, Share2 } from 'lucide-react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import formatCurrency from '../utils/formatCurrency';
import Toast from '../components/Toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].sizeName || data.sizes[0]);
        }
      } catch (err) {
        setError('Sản phẩm không tồn tại hoặc có lỗi khi tải dữ liệu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (result.success) {
      setToast({ type: 'success', message: 'Đã thêm vào giỏ hàng thành công!' });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  
  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Không tìm thấy sản phẩm'}</h2>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.imageUrl) 
    : ['https://via.placeholder.com/800x800?text=Chưa+có+ảnh'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-10 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl shadow-gray-200/50 group">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=Ảnh+lỗi'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === index ? 'border-blue-600 ring-4 ring-blue-500/10 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                {product.category?.name || 'Sản phẩm mới'}
              </span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.1]">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-yellow-700 text-xs font-black">4.8</span>
              </div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">128 Đã bán</span>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${product.stockQuantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </div>
            </div>
            
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter">
                {formatCurrency(product.price)}
              </span>
              <span className="text-lg text-gray-400 line-through font-bold decoration-2 decoration-gray-300">
                {formatCurrency(product.price * 1.25)}
              </span>
              <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded-lg">
                -25%
              </span>
            </div>
          </div>

          <div className="mb-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || 'Sản phẩm cao cấp với chất liệu được tuyển chọn kỹ lưỡng, mang lại trải nghiệm tuyệt vời cho người sử dụng.'}
            </p>
          </div>

          {/* Selection Controls */}
          <div className="space-y-8 mb-10">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Chọn kích thước</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const sizeName = size.sizeName || size;
                    return (
                      <button 
                        key={sizeName}
                        onClick={() => setSelectedSize(sizeName)}
                        className={`min-w-[64px] h-14 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${
                          selectedSize === sizeName 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10' 
                            : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-white'
                        }`}
                      >
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-10">
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Số lượng</h3>
                <div className="flex items-center w-36 bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-black text-gray-900 text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stockQuantity === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-black h-16 rounded-[1.25rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Giao hàng</p>
                <p className="text-xs font-bold text-gray-800">Miễn phí toàn quốc</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đổi trả</p>
                <p className="text-xs font-bold text-gray-800">30 ngày miễn phí</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bảo mật</p>
                <p className="text-xs font-bold text-gray-800">Thanh toán an toàn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
