import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Edit2, Trash2, X, Tag, ShoppingBag, FolderOpen, Save, RefreshCw, Upload, ImagePlus } from 'lucide-react';
import api from '../../api/axios';
import formatCurrency from '../../utils/formatCurrency';
import Toast from '../../components/Toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    brand: '',
    categoryId: '',
    imageUrls: ['']
  });

  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(productsRes.data.content || productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      setToast({ type: 'error', message: 'Không thể tải danh sách sản phẩm hoặc danh mục.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      brand: '',
      categoryId: categories[0]?.id || '',
      imageUrls: ['']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      brand: product.brand || '',
      categoryId: product.categoryId || categories[0]?.id || '',
      imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['']
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...formData.imageUrls];
    updatedUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: updatedUrls }));
  };

  const handleAddImageUrl = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const handleRemoveImageUrl = (index) => {
    const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, imageUrls: updatedUrls.length > 0 ? updatedUrls : [''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId),
        // Filter out empty URLs
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setToast({ type: 'success', message: 'Cập nhật sản phẩm thành công!' });
      } else {
        await api.post('/products', payload);
        setToast({ type: 'success', message: 'Tạo sản phẩm mới thành công!' });
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (error) {
      console.error('Failed to save product', error);
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi lưu sản phẩm.' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await api.delete(`/products/${id}`);
        setToast({ type: 'success', message: 'Đã xóa sản phẩm thành công!' });
        fetchAllData();
      } catch (error) {
        console.error('Failed to delete product', error);
        setToast({ type: 'error', message: 'Không thể xóa sản phẩm này.' });
      }
    }
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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sản phẩm</h1>
          <p className="text-sm text-gray-500 font-bold mt-1">Danh sách sản phẩm trong kho của bạn</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" /> Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <th className="py-4 px-6">Hình ảnh</th>
                <th className="py-4 px-6">Tên sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá</th>
                <th className="py-4 px-6">Số lượng</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="text-gray-700 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                        <img 
                          src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://placehold.co/150x150'} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">{product.name}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-500 font-bold">
                        {categories.find(c => c.id === product.categoryId)?.name || 'Sản phẩm mới'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-red-600">{formatCurrency(product.price)}</td>
                    <td className="py-4 px-6 text-gray-500">{product.stockQuantity} chiếc</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-400 font-bold">Chưa có sản phẩm nào trong cửa hàng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col animate-in zoom-in duration-300">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50 mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Tên sản phẩm *</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Giá sản phẩm *</label>
                  <input 
                    type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="any"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="Giá bán VND"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Số lượng trong kho *</label>
                  <input 
                    type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required min="0"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="Số lượng sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Thương hiệu</label>
                  <input 
                    type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ví dụ: Apple, Sony"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Danh mục *</label>
                  <select 
                    name="categoryId" value={formData.categoryId} onChange={handleInputChange} required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Mô tả sản phẩm</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleInputChange} rows="3"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="Mô tả thông số chi tiết sản phẩm..."
                  ></textarea>
                </div>

                {/* Dynamic Image URLs */}
                <div className="md:col-span-2 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Đường dẫn hình ảnh</label>
                    <button 
                      type="button" onClick={handleAddImageUrl}
                      className="text-xs font-black text-blue-600 hover:text-blue-800"
                    >
                      + Thêm URL
                    </button>
                  </div>
                  
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-3">
                      <input 
                        type="url" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                      />
                      {formData.imageUrls.length > 1 && (
                        <button 
                          type="button" onClick={() => handleRemoveImageUrl(index)}
                          className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* File Upload Section */}
                  <div className="mt-4 p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ImagePlus className="w-4 h-4" /> Tải ảnh từ máy tính
                    </p>
                    <div className="flex gap-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center gap-3 bg-white border-2 border-dashed border-blue-200 rounded-2xl py-3 px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                      >
                        <Upload className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors truncate">
                          {selectedFile ? selectedFile.name : 'Chọn file ảnh (JPG, PNG, WEBP)...'}
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      />
                      <button
                        type="button"
                        disabled={!selectedFile || uploading}
                        onClick={async () => {
                          if (!selectedFile) return;
                          setUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append('file', selectedFile);
                            const res = await api.post('/upload', fd, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const uploadedUrl = res.data?.url || res.data;
                            const fullUrl = uploadedUrl.startsWith('http')
                              ? uploadedUrl
                              : `http://localhost:8080${uploadedUrl}`;
                            setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls.filter(u => u.trim() !== ''), fullUrl] }));
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            setToast({ type: 'success', message: 'Tải ảnh lên thành công!' });
                          } catch (err) {
                            console.error('Upload failed:', err);
                            setToast({ type: 'error', message: 'Tải ảnh thất bại. Kiểm tra lại server.' });
                          } finally {
                            setUploading(false);
                          }
                        }}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 px-5 rounded-2xl text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                      >
                        {uploading ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang tải...</>
                        ) : (
                          <><Upload className="w-4 h-4" /> Upload</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex gap-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-50 text-gray-500 font-black py-4 rounded-2xl text-center transition-all hover:bg-gray-100 text-sm"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-center shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
