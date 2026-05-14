import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components for unimplemented pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-700">{title} - Coming Soon</h2>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Placeholder title="Product List" />} />
        <Route path="products/:id" element={<Placeholder title="Product Detail" />} />
        
        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Placeholder title="Checkout" />} />
          <Route path="orders" element={<Placeholder title="Order History" />} />
          <Route path="profile" element={<Placeholder title="User Profile" />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Placeholder title="Admin Dashboard" />} />
          <Route path="products" element={<Placeholder title="Manage Products" />} />
          <Route path="categories" element={<Placeholder title="Manage Categories" />} />
          <Route path="orders" element={<Placeholder title="Manage Orders" />} />
          <Route path="users" element={<Placeholder title="Manage Users" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
