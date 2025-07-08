package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.LoanCalculatorService;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationRequestDto;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loan-calculator")
@Tag(name = "Loan Calculator API", description = "Endpoints for loan calculations")
@RequiredArgsConstructor
public class LoanCalculatorController {

    private final LoanCalculatorService loanCalculatorService;

    @Operation(summary = "Calculate loan", description = "Calculate loan amount, monthly payment, and total payment based on vehicle price, down payment, interest rate, loan term, trade-in value, and tax rate.")
    @ApiResponse(responseCode = "200", description = "Loan calculation successful", content = @Content(schema = @Schema(implementation = LoanCalculationResponseDto.class)))
    @PostMapping("/calculate")
    public ResponseEntity<LoanCalculationResponseDto> calculateLoan(@RequestBody LoanCalculationRequestDto request) {
        LoanCalculationResponseDto response = loanCalculatorService.calculateLoan(request);
        return ResponseEntity.ok(response);
    }
}
