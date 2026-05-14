import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts({ size: 4 });
        // Depending on backend pagination format, it might be data.content or just data
        setFeaturedProducts(data.content || data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-dark text-white rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 lg:px-16 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Elevate Your Everyday Style
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Discover our curated collection of premium essentials designed for the modern lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-8 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center w-full md:w-1/2">
            <ShoppingBag className="w-64 h-64 text-gray-700 opacity-50" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Our most popular selections this week</p>
          </div>
          <Link to="/products" className="text-primary-600 hover:text-primary-800 font-medium flex items-center transition-colors">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
            No featured products available at the moment.
          </div>
        )}
      </section>

      {/* Value Proposition */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
            <p className="text-gray-500 text-sm">On all orders over $100</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
            <p className="text-gray-500 text-sm">100% secure payment</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
            <p className="text-gray-500 text-sm">30 days return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
