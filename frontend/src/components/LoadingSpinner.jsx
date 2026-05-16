const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full border-gray-100 ${size === 'lg' ? 'border-4' : 'border-2'}`}></div>
        {/* Spinning Ring */}
        <div className={`absolute inset-0 animate-spin rounded-full transition-all duration-500 ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
