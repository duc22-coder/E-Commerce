import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const Toast = ({ type = 'info', message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  if (!isVisible && !onClose) return null;

  return (
    <div className={clsx(
      'fixed bottom-4 right-4 z-50 flex items-center p-4 mb-4 border rounded-lg shadow-lg transition-opacity duration-300',
      bgColors[type],
      isVisible ? 'opacity-100' : 'opacity-0'
    )} role="alert">
      {icons[type]}
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      <button 
        type="button" 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex h-8 w-8 hover:bg-black/5"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
