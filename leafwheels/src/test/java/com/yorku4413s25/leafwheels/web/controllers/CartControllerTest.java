package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.services.CartService;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CartControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CartService cartService;

    private CartController cartController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        cartController = new CartController(cartService);
        mockMvc = MockMvcBuilders.standaloneSetup(cartController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void getCartShouldReturnCartWhenUserExists() throws Exception {
        UUID userId = UUID.randomUUID();
        CartDto cartDto = createSampleCartDto(userId);

        when(cartService.getCartByUserId(userId)).thenReturn(cartDto);

        mockMvc.perform(get("/api/v1/carts/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.id").value(cartDto.getId().toString()));

        verify(cartService).getCartByUserId(userId);
    }

    @Test
    void addItemShouldReturnUpdatedCartWhenValidInput() throws Exception {
        UUID userId = UUID.randomUUID();
        CreateCartItemDto createItemDto = createSampleCreateCartItemDto();
        CartDto updatedCart = createSampleCartDto(userId);

        when(cartService.addItemToCart(eq(userId), any(CreateCartItemDto.class))).thenReturn(updatedCart);

        mockMvc.perform(post("/api/v1/carts/{userId}/items", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createItemDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId.toString()));

        verify(cartService).addItemToCart(eq(userId), any(CreateCartItemDto.class));
    }

    @Test
    void removeItemShouldReturnUpdatedCartWhenItemExists() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID itemId = UUID.randomUUID();
        CartDto updatedCart = createSampleCartDto(userId);

        when(cartService.removeItemFromCart(userId, itemId)).thenReturn(updatedCart);

        mockMvc.perform(delete("/api/v1/carts/{userId}/items/{itemId}", userId, itemId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId.toString()));

        verify(cartService).removeItemFromCart(userId, itemId);
    }

    @Test
    void clearCartShouldReturnNoContentWhenCartExists() throws Exception {
        UUID userId = UUID.randomUUID();

        doNothing().when(cartService).clearCart(userId);

        mockMvc.perform(delete("/api/v1/carts/{userId}", userId))
                .andExpect(status().isNoContent());

        verify(cartService).clearCart(userId);
    }

    private CartDto createSampleCartDto(UUID userId) {
        return CartDto.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .items(new ArrayList<>())
                .build();
    }

    private CreateCartItemDto createSampleCreateCartItemDto() {
        return CreateCartItemDto.builder()
                .type(ItemType.VEHICLE)
                .vehicleId(UUID.randomUUID())
                .unitPrice(new BigDecimal("25000"))
                .quantity(1)
                .build();
    }
}