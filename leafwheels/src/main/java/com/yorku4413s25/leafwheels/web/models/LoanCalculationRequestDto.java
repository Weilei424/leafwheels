package com.yorku4413s25.leafwheels.web.models;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanCalculationRequestDto {
    
    @NotNull
    @DecimalMin(value = "0.01", message = "Vehicle price must be greater than 0")
    private BigDecimal vehiclePrice;
    
    @DecimalMin(value = "0", message = "Down payment cannot be negative")
    private BigDecimal downPayment = BigDecimal.ZERO;
    
    @NotNull
    @DecimalMin(value = "0", message = "Interest rate cannot be negative")
    private BigDecimal interestRate;
    
    @NotNull
    @DecimalMin(value = "1", message = "Loan term must be at least 1 month")
    private Integer loanTermMonths;
    
    @DecimalMin(value = "0", message = "Trade-in value cannot be negative")
    private BigDecimal tradeInValue = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Tax rate cannot be negative")
    private BigDecimal taxRate = BigDecimal.ZERO;
}