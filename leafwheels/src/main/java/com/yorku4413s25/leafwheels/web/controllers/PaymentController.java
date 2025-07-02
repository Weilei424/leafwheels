package com.yorku4413s25.leafwheels.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody Object request) {
        // TODO
        return ResponseEntity.status(501).build();
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Object request) {
        // TODO
        return ResponseEntity.status(501).build();
    }

    @GetMapping("/{orderId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String orderId) {
        // TODO
        return ResponseEntity.status(501).build();
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable String orderId) {
        // TODO
        return ResponseEntity.status(501).build();
    }
}
