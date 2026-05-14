import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 40, color = "#0ea5e9" }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default LoadingSpinner;
