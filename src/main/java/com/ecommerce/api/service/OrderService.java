package com.ecommerce.api.service;

import com.ecommerce.api.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(String userEmail, String shippingAddress, String paymentMethod);
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getOrdersForCurrentUser(String userEmail);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrderStatus(Long id, String status);
}
