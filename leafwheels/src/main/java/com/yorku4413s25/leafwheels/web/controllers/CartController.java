package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.CartService;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(
            summary = "Get user's cart",
            description = "Retrieve the current cart for a given user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart found", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "404", description = "Cart not found", content = @Content)
    })
    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable UUID userId) {
        return new ResponseEntity<>(cartService.getCartByUserId(userId), HttpStatus.OK);
    }

    @Operation(
            summary = "Add item to cart",
            description = "Add a vehicle or accessory to the user's cart."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item added successfully", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or not enough stock", content = @Content)
    })
    @PostMapping("/{userId}/items")
    public ResponseEntity<CartDto> addItem(@PathVariable UUID userId, @RequestBody CreateCartItemDto dto) {
        return new ResponseEntity<>(cartService.addItemToCart(userId, dto), HttpStatus.OK);
    }

    @Operation(
            summary = "Remove item from cart",
            description = "Remove an item from the user's cart by item ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item removed successfully", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content)
    })
    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartDto> removeItem(@PathVariable UUID userId, @PathVariable UUID itemId) {
        return new ResponseEntity<>(cartService.removeItemFromCart(userId, itemId), HttpStatus.OK);
    }

    @Operation(
            summary = "Clear cart",
            description = "Remove all items from the user's cart."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cart cleared"),
            @ApiResponse(responseCode = "404", description = "Cart not found", content = @Content)
    })
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable UUID userId) {
        cartService.clearCart(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
