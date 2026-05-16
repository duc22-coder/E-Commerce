import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, CreditCard, Truck, CheckCircle, Copy, Timer, AlertCircle } from 'lucide-react';
import formatCurrency from '../utils/formatCurrency';
import api from '../api/axios';
import techcombankQr from '../assets/payment/techcombank-qr.png';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    phone: user?.phone || '',
    address: '',
    city: '',
    note: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showCopied, setShowCopied] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cartItems, navigate, step]);

  useEffect(() => {
    let timer;
    if (paymentMethod === 'VIETQR' && step === 2) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentMethod, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Backend expects: { shippingAddress: string, paymentMethod: string }
      const orderData = {
        shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.address}, ${shippingInfo.city}`,
        paymentMethod: paymentMethod === 'VIETQR' ? 'BANK_TRANSFER' : 'COD'
      };
      
      const response = await api.post('/orders', orderData);
      if (response.data) {
        setStep(3);
        clearCart();
      }
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. <br />
          Mã đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ sớm liên hệ để xác nhận.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/orders')}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95"
          >
            Xem lịch sử đơn hàng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => step === 2 ? setStep(1) : navigate('/cart')}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {/* Progress Bar */}
          <div className="flex items-center mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>
            <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-10 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            
            <div className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${step >= 1 ? 'bg-blue-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>1</div>
              <span className={`text-xs mt-2 font-bold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Thông tin</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${step >= 2 ? 'bg-blue-600 text-white scale-110' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>2</div>
              <span className={`text-xs mt-2 font-bold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Thanh toán</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-600" /> Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                  <input 
                    type="text" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập họ và tên người nhận"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                  <input 
                    type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Số điện thoại liên hệ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thành phố *</label>
                  <input 
                    type="text" name="city" value={shippingInfo.city} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Tên thành phố"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ chi tiết *</label>
                  <input 
                    type="text" name="address" value={shippingInfo.address} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Số nhà, tên đường, phường/xã..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                  <textarea 
                    name="note" value={shippingInfo.note} onChange={handleInputChange} rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ghi chú thêm cho người giao hàng"
                  ></textarea>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city}
                className="w-full mt-10 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-xl shadow-blue-600/20"
              >
                Tiếp tục đến thanh toán
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-600" /> Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-500/10' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Thanh toán khi nhận hàng</p>
                      <p className="text-xs text-gray-500 mt-1">Giao hàng và thu tiền tận nơi (COD)</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('VIETQR')}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${paymentMethod === 'VIETQR' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-500/10' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'VIETQR' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Chuyển khoản VietQR</p>
                      <p className="text-xs text-gray-500 mt-1">Quét mã QR qua ứng dụng Ngân hàng</p>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'VIETQR' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in zoom-in duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                      <img src={techcombankQr} alt="Techcombank QR" className="w-full rounded-xl shadow-lg" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-blue-600 shadow-sm">
                        <Timer className="w-3.5 h-3.5 animate-pulse" /> {formatTime(timeLeft)}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Tên tài khoản</p>
                          <p className="text-sm font-bold text-gray-900 uppercase">NGUYEN ANH DUC</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Số tài khoản</p>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-black text-gray-900 tracking-widest">2208 2005 88</p>
                            <button 
                              onClick={() => copyToClipboard('2208200588', 'acc')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              {showCopied === 'acc' ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                          {showCopied === 'acc' && <span className="absolute -top-8 right-0 bg-gray-900 text-white text-[10px] px-2 py-1 rounded">Đã sao chép</span>}
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Ngân hàng</p>
                          <p className="text-sm font-bold text-gray-900 uppercase">Techcombank (TCB)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                        <p className="text-xs text-orange-800 leading-relaxed">
                          Vui lòng quét mã và thực hiện chuyển khoản. Sau khi chuyển xong, nhấn <strong>"Tôi đã thanh toán"</strong> để hoàn tất đơn hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Đang xử lý...' : paymentMethod === 'VIETQR' ? 'Tôi đã thanh toán' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Tóm tắt đơn hàng</h2>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                    <p className="text-xs font-bold text-red-600 mt-1">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span className="text-gray-900 font-bold">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-bold italic">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-2xl font-black text-red-600">{formatCurrency(getCartTotal())}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                Mọi thông tin của bạn đều được bảo mật tuyệt đối theo tiêu chuẩn PCI DSS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for security icon if not imported
const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);

export default Checkout;
