package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;

import java.util.UUID;

public interface CartService {
    CartDto getCartByUserId(UUID userId);
    CartDto addItemToCart(UUID userId, CreateCartItemDto dto);
    CartDto removeItemFromCart(UUID userId, UUID cartItemId);
    void clearCart(UUID userId);
}
