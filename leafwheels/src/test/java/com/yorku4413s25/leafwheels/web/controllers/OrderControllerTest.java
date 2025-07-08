package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.OrderStatus;
import com.yorku4413s25.leafwheels.services.OrderService;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    private OrderController orderController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        orderController = new OrderController(orderService);
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createOrderShouldReturnCreatedOrderWhenValidInput() throws Exception {
        UUID userId = UUID.randomUUID();
        CreateOrderRequestDto requestDto = createSampleOrderRequestDto(userId);
        OrderDto createdOrder = createSampleOrderDto(userId);

        when(orderService.createOrder(eq(userId), any(CreateOrderRequestDto.class))).thenReturn(createdOrder);

        mockMvc.perform(post("/api/v1/orders/{userId}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.status").value(createdOrder.getStatus().toString()));

        verify(orderService).createOrder(eq(userId), any(CreateOrderRequestDto.class));
    }

    @Test
    void getOrderShouldReturnOrderWhenOrderExists() throws Exception {
        UUID orderId = UUID.randomUUID();
        OrderDto orderDto = createSampleOrderDto(UUID.randomUUID());

        when(orderService.getOrderById(orderId)).thenReturn(orderDto);

        mockMvc.perform(get("/api/v1/orders/{orderId}", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderDto.getId().toString()))
                .andExpect(jsonPath("$.status").value(orderDto.getStatus().toString()));

        verify(orderService).getOrderById(orderId);
    }

    @Test
    void getOrdersByUserShouldReturnOrdersWhenUserExists() throws Exception {
        UUID userId = UUID.randomUUID();
        List<OrderDto> orders = Arrays.asList(createSampleOrderDto(userId), createSampleOrderDto(userId));

        when(orderService.getOrdersByUserId(userId)).thenReturn(orders);

        mockMvc.perform(get("/api/v1/orders/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userId").value(userId.toString()));

        verify(orderService).getOrdersByUserId(userId);
    }

    @Test
    void createOrderFromCartShouldReturnCreatedOrderWhenCartExists() throws Exception {
        UUID userId = UUID.randomUUID();
        OrderDto createdOrder = createSampleOrderDto(userId);

        when(orderService.createOrderFromCart(userId)).thenReturn(createdOrder);

        mockMvc.perform(post("/api/v1/orders/from-cart/{userId}", userId))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.status").value(createdOrder.getStatus().toString()));

        verify(orderService).createOrderFromCart(userId);
    }

    @Test
    void cancelOrderShouldReturnOkWhenOrderExists() throws Exception {
        UUID orderId = UUID.randomUUID();

        doNothing().when(orderService).cancelOrder(orderId);

        mockMvc.perform(post("/api/v1/orders/{orderId}/cancel", orderId))
                .andExpect(status().isOk());

        verify(orderService).cancelOrder(orderId);
    }

    private OrderDto createSampleOrderDto(UUID userId) {
        return OrderDto.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .status(OrderStatus.PLACED)
                .totalPrice(new BigDecimal("50000"))
                .items(new ArrayList<>())
                .build();
    }

    private CreateOrderRequestDto createSampleOrderRequestDto(UUID userId) {
        return CreateOrderRequestDto.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .build();
    }
}
