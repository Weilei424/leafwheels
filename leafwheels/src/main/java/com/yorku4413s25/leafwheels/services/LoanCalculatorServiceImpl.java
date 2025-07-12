package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.LoanCalculationRequestDto;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationResponseDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoanCalculatorServiceImpl implements LoanCalculatorService {
    
    @Override
    public LoanCalculationResponseDto calculateLoan(LoanCalculationRequestDto request) {
        BigDecimal vehiclePrice = request.getVehiclePrice();
        BigDecimal downPayment = request.getDownPayment();
        BigDecimal interestRate = request.getInterestRate();
        Integer loanTermMonths = request.getLoanTermMonths();
        BigDecimal tradeInValue = request.getTradeInValue();
        BigDecimal taxRate = request.getTaxRate();

        BigDecimal taxAmount = vehiclePrice.multiply(taxRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal totalAmountWithTax = vehiclePrice.add(taxAmount);

        BigDecimal loanAmount = totalAmountWithTax.subtract(downPayment).subtract(tradeInValue);

        if (loanAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return new LoanCalculationResponseDto(
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    vehiclePrice,
                    downPayment,
                    tradeInValue,
                    taxAmount,
                    totalAmountWithTax
            );
        }

        BigDecimal monthlyRate = interestRate.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(12), 6, RoundingMode.HALF_UP);
        
        BigDecimal monthlyPayment;
        BigDecimal totalPayment;
        BigDecimal totalInterest;
        
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            monthlyPayment = loanAmount.divide(BigDecimal.valueOf(loanTermMonths), 2, RoundingMode.HALF_UP);
            totalPayment = loanAmount;
            totalInterest = BigDecimal.ZERO;
        } else {
            // Calculate monthly payment using loan payment formula
            // M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
            BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
            BigDecimal factor = onePlusRate.pow(loanTermMonths);
            
            BigDecimal numerator = loanAmount.multiply(monthlyRate).multiply(factor);
            BigDecimal denominator = factor.subtract(BigDecimal.ONE);
            
            monthlyPayment = numerator.divide(denominator, 2, RoundingMode.HALF_UP);
            totalPayment = monthlyPayment.multiply(BigDecimal.valueOf(loanTermMonths));
            totalInterest = totalPayment.subtract(loanAmount);
        }
        
        return new LoanCalculationResponseDto(
                loanAmount,
                monthlyPayment,
                totalPayment,
                totalInterest,
                vehiclePrice,
                downPayment,
                tradeInValue,
                taxAmount,
                totalAmountWithTax
        );
    }
}
