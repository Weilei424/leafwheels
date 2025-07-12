package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanCalculationResponseDto {
    
    private BigDecimal loanAmount;
    private BigDecimal monthlyPayment;
    private BigDecimal totalPayment;
    private BigDecimal totalInterest;
    private BigDecimal vehiclePrice;
    private BigDecimal downPayment;
    private BigDecimal tradeInValue;
    private BigDecimal taxAmount;
    private BigDecimal totalAmountWithTax;
}
