package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private String paymentMethod;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String cardHolderName;
    private String address;
}