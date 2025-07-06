package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.services.LoanCalculatorService;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationRequestDto;
import com.yorku4413s25.leafwheels.web.models.LoanCalculationResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class LoanCalculatorControllerTest {

    private MockMvc mockMvc;

    @Mock
    private LoanCalculatorService loanCalculatorService;

    private LoanCalculatorController loanCalculatorController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loanCalculatorController = new LoanCalculatorController(loanCalculatorService);
        mockMvc = MockMvcBuilders.standaloneSetup(loanCalculatorController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void calculateLoanShouldReturnLoanCalculationWhenValidInput() throws Exception {
        LoanCalculationRequestDto requestDto = createSampleLoanCalculationRequest();
        LoanCalculationResponseDto responseDto = createSampleLoanCalculationResponse();

        when(loanCalculatorService.calculateLoan(any(LoanCalculationRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/loan-calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loanAmount").value(responseDto.getLoanAmount()))
                .andExpect(jsonPath("$.monthlyPayment").value(responseDto.getMonthlyPayment()))
                .andExpect(jsonPath("$.totalPayment").value(responseDto.getTotalPayment()))
                .andExpect(jsonPath("$.totalInterest").value(responseDto.getTotalInterest()))
                .andExpect(jsonPath("$.vehiclePrice").value(responseDto.getVehiclePrice()))
                .andExpect(jsonPath("$.downPayment").value(responseDto.getDownPayment()))
                .andExpect(jsonPath("$.tradeInValue").value(responseDto.getTradeInValue()))
                .andExpect(jsonPath("$.taxAmount").value(responseDto.getTaxAmount()))
                .andExpect(jsonPath("$.totalAmountWithTax").value(responseDto.getTotalAmountWithTax()));

        verify(loanCalculatorService).calculateLoan(any(LoanCalculationRequestDto.class));
    }

    @Test
    void calculateLoanShouldReturnLoanCalculationWithMinimalInput() throws Exception {
        LoanCalculationRequestDto requestDto = createMinimalLoanCalculationRequest();
        LoanCalculationResponseDto responseDto = createMinimalLoanCalculationResponse();

        when(loanCalculatorService.calculateLoan(any(LoanCalculationRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/loan-calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loanAmount").value(responseDto.getLoanAmount()))
                .andExpect(jsonPath("$.monthlyPayment").value(responseDto.getMonthlyPayment()))
                .andExpect(jsonPath("$.totalPayment").value(responseDto.getTotalPayment()));

        verify(loanCalculatorService).calculateLoan(any(LoanCalculationRequestDto.class));
    }

    @Test
    void calculateLoanShouldReturnLoanCalculationWithZeroDownPayment() throws Exception {
        LoanCalculationRequestDto requestDto = createZeroDownPaymentRequest();
        LoanCalculationResponseDto responseDto = createZeroDownPaymentResponse();

        when(loanCalculatorService.calculateLoan(any(LoanCalculationRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/loan-calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loanAmount").value(responseDto.getLoanAmount()))
                .andExpect(jsonPath("$.downPayment").value(0))
                .andExpect(jsonPath("$.monthlyPayment").value(responseDto.getMonthlyPayment()));

        verify(loanCalculatorService).calculateLoan(any(LoanCalculationRequestDto.class));
    }

    @Test
    void calculateLoanShouldReturnLoanCalculationWithTradeInValue() throws Exception {
        LoanCalculationRequestDto requestDto = createTradeInValueRequest();
        LoanCalculationResponseDto responseDto = createTradeInValueResponse();

        when(loanCalculatorService.calculateLoan(any(LoanCalculationRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/loan-calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loanAmount").value(responseDto.getLoanAmount()))
                .andExpect(jsonPath("$.tradeInValue").value(responseDto.getTradeInValue()))
                .andExpect(jsonPath("$.monthlyPayment").value(responseDto.getMonthlyPayment()));

        verify(loanCalculatorService).calculateLoan(any(LoanCalculationRequestDto.class));
    }

    @Test
    void calculateLoanShouldCallServiceExactlyOnce() throws Exception {
        LoanCalculationRequestDto requestDto = createSampleLoanCalculationRequest();
        LoanCalculationResponseDto responseDto = createSampleLoanCalculationResponse();

        when(loanCalculatorService.calculateLoan(any(LoanCalculationRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/loan-calculator/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        verify(loanCalculatorService, times(1)).calculateLoan(any(LoanCalculationRequestDto.class));
        verifyNoMoreInteractions(loanCalculatorService);
    }

    private LoanCalculationRequestDto createSampleLoanCalculationRequest() {
        return LoanCalculationRequestDto.builder()
                .vehiclePrice(new BigDecimal("25000.0"))
                .downPayment(new BigDecimal("5000.0"))
                .interestRate(new BigDecimal("5.5"))
                .loanTermMonths(60)
                .tradeInValue(new BigDecimal("3000.0"))
                .taxRate(new BigDecimal("13.0"))
                .build();
    }

    private LoanCalculationResponseDto createSampleLoanCalculationResponse() {
        return LoanCalculationResponseDto.builder()
                .loanAmount(new BigDecimal("17000.0"))
                .monthlyPayment(new BigDecimal("325.5"))
                .totalPayment(new BigDecimal("19530.0"))
                .totalInterest(new BigDecimal("2530.0"))
                .vehiclePrice(new BigDecimal("25000.0"))
                .downPayment(new BigDecimal("5000.0"))
                .tradeInValue(new BigDecimal("3000.0"))
                .taxAmount(new BigDecimal("3250.0"))
                .totalAmountWithTax(new BigDecimal("28250.0"))
                .build();
    }

    private LoanCalculationRequestDto createMinimalLoanCalculationRequest() {
        return LoanCalculationRequestDto.builder()
                .vehiclePrice(new BigDecimal("20000.0"))
                .downPayment(new BigDecimal("0.0"))
                .interestRate(new BigDecimal("4.0"))
                .loanTermMonths(48)
                .tradeInValue(new BigDecimal("0.0"))
                .taxRate(new BigDecimal("0.0"))
                .build();
    }

    private LoanCalculationResponseDto createMinimalLoanCalculationResponse() {
        return LoanCalculationResponseDto.builder()
                .loanAmount(new BigDecimal("20000.0"))
                .monthlyPayment(new BigDecimal("451.6"))
                .totalPayment(new BigDecimal("21676.8"))
                .totalInterest(new BigDecimal("1676.8"))
                .vehiclePrice(new BigDecimal("20000.0"))
                .downPayment(new BigDecimal("0.0"))
                .tradeInValue(new BigDecimal("0.0"))
                .taxAmount(new BigDecimal("0.0"))
                .totalAmountWithTax(new BigDecimal("20000.0"))
                .build();
    }

    private LoanCalculationRequestDto createZeroDownPaymentRequest() {
        return LoanCalculationRequestDto.builder()
                .vehiclePrice(new BigDecimal("30000.0"))
                .downPayment(new BigDecimal("0.0"))
                .interestRate(new BigDecimal("6.0"))
                .loanTermMonths(72)
                .tradeInValue(new BigDecimal("0.0"))
                .taxRate(new BigDecimal("8.0"))
                .build();
    }

    private LoanCalculationResponseDto createZeroDownPaymentResponse() {
        return LoanCalculationResponseDto.builder()
                .loanAmount(new BigDecimal("32400.0"))
                .monthlyPayment(new BigDecimal("524.3"))
                .totalPayment(new BigDecimal("37749.6"))
                .totalInterest(new BigDecimal("5349.6"))
                .vehiclePrice(new BigDecimal("30000.0"))
                .downPayment(new BigDecimal("0.0"))
                .tradeInValue(new BigDecimal("0.0"))
                .taxAmount(new BigDecimal("2400.0"))
                .totalAmountWithTax(new BigDecimal("32400.0"))
                .build();
    }

    private LoanCalculationRequestDto createTradeInValueRequest() {
        return LoanCalculationRequestDto.builder()
                .vehiclePrice(new BigDecimal("35000.0"))
                .downPayment(new BigDecimal("2000.0"))
                .interestRate(new BigDecimal("3.5"))
                .loanTermMonths(36)
                .tradeInValue(new BigDecimal("8000.0"))
                .taxRate(new BigDecimal("10.0"))
                .build();
    }

    private LoanCalculationResponseDto createTradeInValueResponse() {
        return LoanCalculationResponseDto.builder()
                .loanAmount(new BigDecimal("25500.0"))
                .monthlyPayment(new BigDecimal("743.5"))
                .totalPayment(new BigDecimal("26766.0"))
                .totalInterest(new BigDecimal("1266.0"))
                .vehiclePrice(new BigDecimal("35000.0"))
                .downPayment(new BigDecimal("2000.0"))
                .tradeInValue(new BigDecimal("8000.0"))
                .taxAmount(new BigDecimal("3500.0"))
                .totalAmountWithTax(new BigDecimal("38500.0"))
                .build();
    }
}