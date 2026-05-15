package com.ecommerce.api.service;

import com.ecommerce.api.dto.CartDTO;

public interface CartService {
    CartDTO getCartForCurrentUser(String userEmail);
    CartDTO addItemToCart(String userEmail, Long productId, Integer quantity);
    CartDTO updateItemQuantity(String userEmail, Long cartItemId, Integer quantity);
    CartDTO removeItemFromCart(String userEmail, Long cartItemId);
    void clearCart(String userEmail);
}
