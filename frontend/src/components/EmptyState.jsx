import { PackageX } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon = PackageX, 
  title = 'No items found', 
  message = 'We could not find any items matching your request.',
  actionText = 'Go Back',
  actionLink = '/'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="p-4 bg-gray-50 rounded-full mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{message}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
