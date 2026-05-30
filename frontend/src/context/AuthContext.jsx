import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Centralized logout function
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // Single source of truth for user state based on the JWT
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check for token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Token expired, logging out.");
          logout();
          return;
        }

        // Set user state strictly from token payload
        setUser({
          username: decoded.sub,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          roles: decoded.roles || [],
        });
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      // Setting token triggers the useEffect above to decode and set user
      setToken(token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  }), [user, token, loading, logout, isAuthenticated, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
