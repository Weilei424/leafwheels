package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.LoanCalculationRequestDto;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationResponseDto;

public interface LoanCalculatorService {
    LoanCalculationResponseDto calculateLoan(LoanCalculationRequestDto request);
}