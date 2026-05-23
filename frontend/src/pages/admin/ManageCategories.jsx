import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Save, FolderOpen } from 'lucide-react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories', error);
      setToast({ type: 'error', message: 'Không thể tải danh sách danh mục.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        setToast({ type: 'success', message: 'Cập nhật danh mục thành công!' });
      } else {
        await api.post('/categories', formData);
        setToast({ type: 'success', message: 'Tạo danh mục mới thành công!' });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category', error);
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi lưu danh mục.' });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục sẽ bị ảnh hưởng.')) {
      try {
        await api.delete(`/categories/${id}`);
        setToast({ type: 'success', message: 'Đã xóa danh mục thành công!' });
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category', error);
        setToast({ type: 'error', message: 'Không thể xóa danh mục này.' });
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Danh mục</h1>
          <p className="text-sm text-gray-500 font-bold mt-1">Quản lý các danh mục phân loại sản phẩm</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" /> Thêm danh mục
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Tên danh mục</th>
                <th className="py-4 px-6">Mô tả</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="text-gray-700 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 text-gray-400">#{category.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      {category.name}
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-sm truncate">{category.description || 'Không có mô tả'}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleOpenEditModal(category)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
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
                  <td colSpan="4" className="py-20 text-center text-gray-400 font-bold">Chưa có danh mục nào được tạo</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 md:p-12 border border-gray-100 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50 mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Tag className="w-6 h-6 text-blue-600" />
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Tên danh mục *</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ví dụ: Điện thoại, Thời trang"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Mô tả chi tiết</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange} rows="4"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Mô tả nhóm sản phẩm thuộc danh mục..."
                ></textarea>
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
                  <Save className="w-5 h-5" /> Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
