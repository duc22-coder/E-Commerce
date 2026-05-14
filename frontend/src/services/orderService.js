import api from '../api/axios';

const orderService = {
  createOrder: async (orderData) => {
    // Backend uses @RequestParam for shippingAddress and paymentMethod
    const response = await api.post('/orders', null, { params: orderData });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Admin endpoints
  getAllOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, null, { params: { status } });
    return response.data;
  }
};

export default orderService;
