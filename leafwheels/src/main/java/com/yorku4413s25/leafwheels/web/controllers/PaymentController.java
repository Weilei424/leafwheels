package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.PaymentService;
import com.yorku4413s25.leafwheels.web.models.PaymentRequestDto;
import com.yorku4413s25.leafwheels.web.models.PaymentResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment processing endpoints for vehicle and accessory purchases")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
        summary = "Create payment session",
        description = "Initiates a secure payment session for the user's cart. Validates cart contents and creates session state for payment processing."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment session created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid user ID or cart is empty"),
        @ApiResponse(responseCode = "404", description = "User or cart not found")
    })
    @PostMapping("/session")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<Void> createPaymentSession(
            @Parameter(description = "User ID to create payment session for", required = true)
            @RequestParam UUID userId,
            HttpSession httpSession) {
        paymentService.createPaymentSession(userId, httpSession);
        httpSession.setAttribute("userId", userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(
        summary = "Process payment",
        description = "Processes payment for the user's cart. Validates session, creates order, and attempts payment processing with 67% approval rate simulation."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Payment processed successfully",
            content = @Content(schema = @Schema(implementation = PaymentResponseDto.class))
        ),
        @ApiResponse(responseCode = "400", description = "Invalid payment session or cart modified"),
        @ApiResponse(responseCode = "402", description = "Payment declined"),
        @ApiResponse(responseCode = "404", description = "Cart or session not found")
    })
    @PostMapping("/process")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> processPayment(
            @Parameter(description = "Payment details including card information and billing address", required = true)
            @RequestBody PaymentRequestDto paymentRequest,
            HttpSession httpSession) {

        UUID userId = (UUID) httpSession.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        PaymentResponseDto response = paymentService.processPayment(userId, paymentRequest, httpSession);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Get payment status",
        description = "Retrieves the current payment status for a specific order"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Payment status retrieved successfully",
            content = @Content(schema = @Schema(implementation = PaymentResponseDto.class))
        ),
        @ApiResponse(responseCode = "404", description = "Payment not found for the given order ID")
    })
    @GetMapping("/{orderId}/status")
    @PreAuthorize("@securityService.isOrderOwnedByUser(#orderId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponseDto> getPaymentStatus(
            @Parameter(description = "Order ID to get payment status for", required = true)
            @PathVariable UUID orderId) {
        PaymentResponseDto response = paymentService.getPaymentStatus(orderId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Get user payment history",
        description = "Retrieves all payment records for a specific user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Payment history retrieved successfully",
            content = @Content(schema = @Schema(implementation = PaymentResponseDto.class))
        ),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("@securityService.isCurrentUser(#userId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByUser(
            @Parameter(description = "User ID to get payment history for", required = true)
            @PathVariable UUID userId) {
        List<PaymentResponseDto> payments = paymentService.getPaymentsByUserId(userId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @Operation(
        summary = "Cancel/refund payment",
        description = "Cancels an approved payment and refunds the amount. Reverts vehicle status to available and cancels the associated order."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment cancelled/refunded successfully"),
        @ApiResponse(responseCode = "400", description = "Payment cannot be cancelled (not approved or already refunded)"),
        @ApiResponse(responseCode = "404", description = "Payment not found for the given order ID")
    })
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("@securityService.isOrderOwnedByUser(#orderId, authentication) or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelPayment(
            @Parameter(description = "Order ID to cancel payment for", required = true)
            @PathVariable UUID orderId) {
        paymentService.cancelPayment(orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
