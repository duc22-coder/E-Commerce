import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      // When logged in, we rely on backend, but could still keep a backup
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      // Merge logic could be here if we wanted to merge guest cart to backend
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        await api.post('/cart/items', null, { params: { productId, quantity } });
        await fetchCart();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add to cart'
        };
      }
    } else {
      // Guest cart logic
      try {
        // We need product info for guest cart display
        // For simplicity, we'll fetch product details or just store ID
        // In a real app, you'd fetch the product details here or have them passed in
        const response = await api.get(`/products/${productId}`);
        const product = response.data;
        
        setCartItems(prev => {
          const existing = prev.find(item => item.productId === productId);
          if (existing) {
            return prev.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.price } 
                : item
            );
          }
          return [...prev, {
            id: Date.now(), // temporary ID
            productId: product.id,
            productName: product.name,
            productImageUrl: product.imageUrl,
            price: product.price,
            quantity: quantity,
            subtotal: quantity * product.price
          }];
        });
        return { success: true };
      } catch (error) {
        return { success: false, message: 'Failed to add to cart' };
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        await api.put(`/cart/items/${itemId}`, null, { params: { quantity } });
        await fetchCart();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update quantity'
        };
      }
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity, subtotal: quantity * item.price } : item
      ));
      return { success: true };
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/items/${itemId}`);
        await fetchCart();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to remove from cart'
        };
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
        setCartItems([]);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to clear cart'
        };
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
      return { success: true };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
