package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.PaymentStatus;
import com.yorku4413s25.leafwheels.services.PaymentService;
import com.yorku4413s25.leafwheels.web.models.PaymentRequestDto;
import com.yorku4413s25.leafwheels.web.models.PaymentResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;

    private PaymentController paymentController;
    private ObjectMapper objectMapper;
    private MockHttpSession mockSession;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        paymentController = new PaymentController(paymentService);
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
        objectMapper = new ObjectMapper();
        mockSession = new MockHttpSession();
    }

    @Test
    void createPaymentSessionShouldReturnOkWhenValidUser() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(paymentService).createPaymentSession(eq(userId), any());

        mockMvc.perform(post("/api/v1/payment/session")
                .param("userId", userId.toString())
                .session(mockSession))
                .andExpect(status().isOk());

        verify(paymentService).createPaymentSession(eq(userId), any());
    }

    @Test
    void processPaymentShouldReturnOkWhenValidSessionAndRequest() throws Exception {
        UUID userId = UUID.randomUUID();
        mockSession.setAttribute("userId", userId);
        
        PaymentRequestDto paymentRequest = createSamplePaymentRequest();
        PaymentResponseDto paymentResponse = createSamplePaymentResponse(userId);

        when(paymentService.processPayment(eq(userId), eq(paymentRequest), any()))
                .thenReturn(paymentResponse);

        mockMvc.perform(post("/api/v1/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest))
                .session(mockSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(paymentResponse.getId().toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.status").value("APPROVED"));

        verify(paymentService).processPayment(eq(userId), eq(paymentRequest), any());
    }

    @Test
    void processPaymentShouldReturnBadRequestWhenNoUserInSession() throws Exception {
        PaymentRequestDto paymentRequest = createSamplePaymentRequest();

        mockMvc.perform(post("/api/v1/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest))
                .session(mockSession))
                .andExpect(status().isBadRequest());

        verify(paymentService, never()).processPayment(any(), any(), any());
    }

    @Test
    void getPaymentStatusShouldReturnPaymentWhenOrderExists() throws Exception {
        UUID orderId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        PaymentResponseDto paymentResponse = createSamplePaymentResponse(userId);
        paymentResponse.setOrderId(orderId);

        when(paymentService.getPaymentStatus(orderId)).thenReturn(paymentResponse);

        mockMvc.perform(get("/api/v1/payment/{orderId}/status", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(orderId.toString()))
                .andExpect(jsonPath("$.status").value("APPROVED"));

        verify(paymentService).getPaymentStatus(orderId);
    }

    @Test
    void getPaymentsByUserShouldReturnPaymentListWhenUserExists() throws Exception {
        UUID userId = UUID.randomUUID();
        List<PaymentResponseDto> payments = Arrays.asList(
                createSamplePaymentResponse(userId),
                createSamplePaymentResponse(userId)
        );

        when(paymentService.getPaymentsByUserId(userId)).thenReturn(payments);

        mockMvc.perform(get("/api/v1/payment/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userId").value(userId.toString()));

        verify(paymentService).getPaymentsByUserId(userId);
    }

    @Test
    void cancelPaymentShouldReturnOkWhenOrderExists() throws Exception {
        UUID orderId = UUID.randomUUID();

        doNothing().when(paymentService).cancelPayment(orderId);

        mockMvc.perform(post("/api/v1/payment/{orderId}/cancel", orderId))
                .andExpect(status().isOk());

        verify(paymentService).cancelPayment(orderId);
    }

    @Test
    void createPaymentSessionShouldStoreUserIdInSession() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(paymentService).createPaymentSession(eq(userId), any());

        mockMvc.perform(post("/api/v1/payment/session")
                .param("userId", userId.toString())
                .session(mockSession))
                .andExpect(status().isOk());

        verify(paymentService).createPaymentSession(eq(userId), any());
    }

    private PaymentRequestDto createSamplePaymentRequest() {
        return PaymentRequestDto.builder()
                .paymentMethod("CREDIT_CARD")
                .cardNumber("4111111111111111")
                .expiryDate("12/25")
                .cvv("123")
                .cardHolderName("John Doe")
                .address("123 Main St, Toronto, ON")
                .build();
    }

    private PaymentResponseDto createSamplePaymentResponse(UUID userId) {
        return PaymentResponseDto.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .orderId(UUID.randomUUID())
                .amount(new BigDecimal("75990.00"))
                .status(PaymentStatus.APPROVED)
                .paymentMethod("CREDIT_CARD")
                .transactionId("txn_" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .message("Payment processed successfully")
                .build();
    }
}