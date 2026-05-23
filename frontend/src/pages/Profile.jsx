import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Shield, Save, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data) {
          setFormData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            phone: response.data.phone || ''
          });
          // Synchronize auth context state
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile details', error);
        setToast({ type: 'error', message: 'Không thể tải thông tin cá nhân.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.put('/users/me', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      if (response.data) {
        setUser(response.data);
        setToast({ type: 'success', message: 'Cập nhật thông tin thành công!' });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      setToast({ type: 'error', message: 'Cập nhật thông tin thất bại.' });
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-50 mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg shrink-0">
            {formData.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="text-sm text-gray-400 font-bold">{formData.email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
              {user?.roles?.map(role => (
                <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3 h-3" /> {role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Tên *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nhập tên"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Họ *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nhập họ"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Email (Tài khoản - Không thể thay đổi)</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full bg-gray-100 border border-transparent rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none cursor-not-allowed text-gray-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">Số điện thoại *</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
