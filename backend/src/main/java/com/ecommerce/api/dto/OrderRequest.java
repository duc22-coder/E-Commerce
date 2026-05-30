package com.ecommerce.api.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String paymentMethod;
}
