package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.CartService;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public CartDto getCart(@PathVariable UUID userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/{userId}/items")
    public CartDto addItem(@PathVariable UUID userId, @RequestBody CreateCartItemDto dto) {
        return cartService.addItemToCart(userId, dto);
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public CartDto removeItem(@PathVariable UUID userId, @PathVariable UUID itemId) {
        return cartService.removeItemFromCart(userId, itemId);
    }

    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable UUID userId) {
        cartService.clearCart(userId);
    }
}
