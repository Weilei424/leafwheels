package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanCalculationResponseDto {
    
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal loanAmount;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal monthlyPayment;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal totalPayment;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal totalInterest;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal vehiclePrice;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal downPayment;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal tradeInValue;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal taxAmount;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal totalAmountWithTax;
}
