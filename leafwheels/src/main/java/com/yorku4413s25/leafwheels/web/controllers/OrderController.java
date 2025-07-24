package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.OrderService;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Order API", description = "Endpoints for managing orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Create a new order", description = "Create an order for a given user with items.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order created", content = @Content(schema = @Schema(implementation = OrderDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content)
    })
    @PostMapping("/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> createOrder(@PathVariable UUID userId, @RequestBody CreateOrderRequestDto dto) {
        return new ResponseEntity<>(orderService.createOrder(userId, dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Get order by ID", description = "Retrieve an order by its order ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order found", content = @Content(schema = @Schema(implementation = OrderDto.class))),
            @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @GetMapping("/{orderId}")
    @PreAuthorize("@securityService.isOrderOwnedByUser(#orderId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> getOrder(@PathVariable UUID orderId) {
        return new ResponseEntity<>(orderService.getOrderById(orderId), HttpStatus.OK);
    }

    @Operation(summary = "Get orders for a user", description = "List all orders for a specific user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders found", content = @Content(schema = @Schema(implementation = OrderDto.class))),
            @ApiResponse(responseCode = "404", description = "No orders for user", content = @Content)
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable UUID userId) {
        return new ResponseEntity<>(orderService.getOrdersByUserId(userId), HttpStatus.OK);
    }

    @Operation(summary = "Create order from cart", description = "Convert the user's current cart into an order.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order created from cart", content = @Content(schema = @Schema(implementation = OrderDto.class))),
            @ApiResponse(responseCode = "400", description = "Cart is empty or not found", content = @Content)
    })
    @PostMapping("/from-cart/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> createOrderFromCart(@PathVariable UUID userId) {
        return new ResponseEntity<>(orderService.createOrderFromCart(userId), HttpStatus.CREATED);
    }

    @Operation(summary = "Cancel an order", description = "Cancel an order and restore item states (stock/vehicle availability).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order canceled successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("@securityService.isOrderOwnedByUser(#orderId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId) {
        orderService.cancelOrder(orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
