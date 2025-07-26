package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.CartService;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
@Tag(name = "Cart API", description = "Endpoints for managing carts")
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
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
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
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
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
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<CartDto> removeItem(@PathVariable UUID userId, @PathVariable UUID itemId) {
        return new ResponseEntity<>(cartService.removeItemFromCart(userId, itemId), HttpStatus.OK);
    }

    @Operation(
            summary = "Clear cart",
            description = "Remove all items from the user's cart."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart cleared", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "404", description = "Cart not found", content = @Content)
    })
    @DeleteMapping("/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<CartDto> clearCart(@PathVariable UUID userId) {
        return new ResponseEntity<>(cartService.clearCart(userId), HttpStatus.OK);
    }

    @Operation(
            summary = "Increment accessory quantity",
            description = "Increase the quantity of an accessory in the cart by 1."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Accessory quantity incremented", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "400", description = "Not enough stock", content = @Content),
            @ApiResponse(responseCode = "404", description = "Accessory not found in cart", content = @Content)
    })
    @PutMapping("/{userId}/accessories/{accessoryId}/increment")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<CartDto> incrementAccessory(@PathVariable UUID userId, @PathVariable UUID accessoryId) {
        return new ResponseEntity<>(cartService.incrementAccessoryInCart(userId, accessoryId), HttpStatus.OK);
    }

    @Operation(
            summary = "Decrement accessory quantity",
            description = "Decrease the quantity of an accessory in the cart by 1. Removes the item if quantity reaches 0."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Accessory quantity decremented", content = @Content(schema = @Schema(implementation = CartDto.class))),
            @ApiResponse(responseCode = "404", description = "Accessory not found in cart", content = @Content)
    })
    @PutMapping("/{userId}/accessories/{accessoryId}/decrement")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<CartDto> decrementAccessory(@PathVariable UUID userId, @PathVariable UUID accessoryId) {
        return new ResponseEntity<>(cartService.decrementAccessoryInCart(userId, accessoryId), HttpStatus.OK);
    }
}
