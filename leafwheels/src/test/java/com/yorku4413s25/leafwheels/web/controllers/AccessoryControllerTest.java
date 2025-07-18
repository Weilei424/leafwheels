package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.exception.ApplicationExceptionHandler;
import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import com.yorku4413s25.leafwheels.web.models.AccessoryRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AccessoryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AccessoryService accessoryService;

    private AccessoryController accessoryController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        accessoryController = new AccessoryController(accessoryService);
        mockMvc = MockMvcBuilders.standaloneSetup(accessoryController)
                .setControllerAdvice(new ApplicationExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void getAllAccessoriesShouldReturnListOfAccessories() throws Exception {
        List<AccessoryDto> accessories = Arrays.asList(createSampleAccessoryDto(), createSampleAccessoryDto());

        when(accessoryService.getAllAccessories()).thenReturn(accessories);

        mockMvc.perform(get("/api/v1/accessories/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Test Accessory"))
                .andExpect(jsonPath("$[0].price").value(99.99));

        verify(accessoryService).getAllAccessories();
    }

    @Test
    void getAccessoryShouldReturnAccessoryWhenAccessoryExists() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryDto accessoryDto = createSampleAccessoryDto();

        when(accessoryService.getAccessoryById(accessoryId)).thenReturn(accessoryDto);

        mockMvc.perform(get("/api/v1/accessories/{id}", accessoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(accessoryDto.getName()))
                .andExpect(jsonPath("$.price").value(accessoryDto.getPrice()));

        verify(accessoryService).getAccessoryById(accessoryId);
    }

    @Test
    void createAccessoryShouldReturnCreatedAccessoryWhenValidInput() throws Exception {
        AccessoryRequestDto inputDto = createSampleAccessoryRequestDto();
        AccessoryDto createdDto = createSampleAccessoryDto();

        when(accessoryService.createAccessory(any(AccessoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(createdDto.getName()))
                .andExpect(jsonPath("$.price").value(createdDto.getPrice()))
                .andExpect(jsonPath("$.discountAmount").value(createdDto.getDiscountAmount()))
                .andExpect(jsonPath("$.discountPercentage").value(createdDto.getDiscountPercentage()))
                .andExpect(jsonPath("$.discountPrice").value(createdDto.getDiscountPrice()))
                .andExpect(jsonPath("$.onDeal").value(createdDto.getOnDeal()));

        verify(accessoryService).createAccessory(any(AccessoryDto.class));
    }

    @Test
    void deleteAccessoryShouldReturnNoContentWhenAccessoryExists() throws Exception {
        UUID accessoryId = UUID.randomUUID();

        doNothing().when(accessoryService).deleteAccessory(accessoryId);

        mockMvc.perform(delete("/api/v1/accessories/{id}", accessoryId))
                .andExpect(status().isNoContent());

        verify(accessoryService).deleteAccessory(accessoryId);
    }

    @Test
    void updateAccessoryShouldReturnUpdatedAccessoryWhenValidInput() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryRequestDto inputDto = createSampleAccessoryRequestDto();
        AccessoryDto updatedDto = createSampleAccessoryDto();

        when(accessoryService.updateById(eq(accessoryId), any(AccessoryDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/accessories/{id}", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(updatedDto.getName()))
                .andExpect(jsonPath("$.discountAmount").value(updatedDto.getDiscountAmount()))
                .andExpect(jsonPath("$.discountPercentage").value(updatedDto.getDiscountPercentage()))
                .andExpect(jsonPath("$.discountPrice").value(updatedDto.getDiscountPrice()))
                .andExpect(jsonPath("$.onDeal").value(updatedDto.getOnDeal()));

        verify(accessoryService).updateById(eq(accessoryId), any(AccessoryDto.class));
    }

    @Test
    void addImageUrlsShouldReturnUpdatedAccessoryWhenValidInput() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        List<String> imageUrls = Arrays.asList("https://example.com/accessory1.jpg", "https://example.com/accessory2.jpg");
        AccessoryDto updatedAccessory = createSampleAccessoryDto();
        updatedAccessory.setId(accessoryId);
        updatedAccessory.setImageUrls(imageUrls);

        when(accessoryService.addImageUrls(accessoryId, imageUrls)).thenReturn(updatedAccessory);

        mockMvc.perform(post("/api/v1/accessories/{id}/images", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(imageUrls)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(accessoryId.toString()))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls.length()").value(2))
                .andExpect(jsonPath("$.imageUrls[0]").value("https://example.com/accessory1.jpg"));

        verify(accessoryService).addImageUrls(accessoryId, imageUrls);
    }

    @Test
    void createAccessoryWithDiscountAmountShouldReturnAccessoryWithCalculatedDiscountPrice() throws Exception {
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithDiscountAmount();
        AccessoryDto createdDto = createAccessoryDtoWithDiscountAmount();

        when(accessoryService.createAccessory(any(AccessoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(createdDto.getName()))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.discountAmount").value(20.00))
                .andExpect(jsonPath("$.discountPercentage").value(0.00))
                .andExpect(jsonPath("$.discountPrice").value(79.99))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(accessoryService).createAccessory(any(AccessoryDto.class));
    }

    @Test
    void createAccessoryWithDiscountPercentageShouldReturnAccessoryWithCalculatedDiscountPrice() throws Exception {
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithDiscountPercentage();
        AccessoryDto createdDto = createAccessoryDtoWithDiscountPercentage();

        when(accessoryService.createAccessory(any(AccessoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(createdDto.getName()))
                .andExpect(jsonPath("$.price").value(100.00))
                .andExpect(jsonPath("$.discountAmount").value(0.00))
                .andExpect(jsonPath("$.discountPercentage").value(0.15))
                .andExpect(jsonPath("$.discountPrice").value(85.00))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(accessoryService).createAccessory(any(AccessoryDto.class));
    }

    @Test
    void createAccessoryWithBothDiscountsShouldThrowException() throws Exception {
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithBothDiscounts();

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());

        // Service should not be called since validation happens at controller level
        verify(accessoryService, never()).createAccessory(any(AccessoryDto.class));
    }

    @Test
    void updateAccessoryWithDiscountAmountShouldReturnUpdatedAccessoryWithCalculatedDiscountPrice() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithDiscountAmount();
        AccessoryDto updatedDto = createAccessoryDtoWithDiscountAmount();

        when(accessoryService.updateById(eq(accessoryId), any(AccessoryDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/accessories/{id}", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(updatedDto.getName()))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.discountAmount").value(20.00))
                .andExpect(jsonPath("$.discountPercentage").value(0.00))
                .andExpect(jsonPath("$.discountPrice").value(79.99))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(accessoryService).updateById(eq(accessoryId), any(AccessoryDto.class));
    }

    @Test
    void updateAccessoryWithDiscountPercentageShouldReturnUpdatedAccessoryWithCalculatedDiscountPrice() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithDiscountPercentage();
        AccessoryDto updatedDto = createAccessoryDtoWithDiscountPercentage();

        when(accessoryService.updateById(eq(accessoryId), any(AccessoryDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/accessories/{id}", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(updatedDto.getName()))
                .andExpect(jsonPath("$.price").value(100.00))
                .andExpect(jsonPath("$.discountAmount").value(0.00))
                .andExpect(jsonPath("$.discountPercentage").value(0.15))
                .andExpect(jsonPath("$.discountPrice").value(85.00))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(accessoryService).updateById(eq(accessoryId), any(AccessoryDto.class));
    }

    @Test
    void updateAccessoryWithBothDiscountsShouldThrowException() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryRequestDto inputDto = createAccessoryRequestDtoWithBothDiscounts();

        mockMvc.perform(put("/api/v1/accessories/{id}", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());

        // Service should not be called since validation happens at controller level
        verify(accessoryService, never()).updateById(eq(accessoryId), any(AccessoryDto.class));
    }

    @Test
    void createAccessoryWithNoDiscountShouldReturnAccessoryWithPriceAsDiscountPrice() throws Exception {
        AccessoryRequestDto inputDto = createSampleAccessoryRequestDto();
        AccessoryDto createdDto = createSampleAccessoryDto();

        when(accessoryService.createAccessory(any(AccessoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(createdDto.getName()))
                .andExpect(jsonPath("$.price").value(99.99))
                .andExpect(jsonPath("$.discountAmount").value(0.00))
                .andExpect(jsonPath("$.discountPercentage").value(0.00))
                .andExpect(jsonPath("$.discountPrice").value(99.99))
                .andExpect(jsonPath("$.onDeal").value(false));

        verify(accessoryService).createAccessory(any(AccessoryDto.class));
    }

    @Test
    void getAllAccessoriesShouldReturnListOfAccessoriesWithDiscountFields() throws Exception {
        List<AccessoryDto> accessories = Arrays.asList(
                createSampleAccessoryDto(),
                createAccessoryDtoWithDiscountAmount(),
                createAccessoryDtoWithDiscountPercentage()
        );

        when(accessoryService.getAllAccessories()).thenReturn(accessories);

        mockMvc.perform(get("/api/v1/accessories/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].name").value("Test Accessory"))
                .andExpect(jsonPath("$[0].price").value(99.99))
                .andExpect(jsonPath("$[0].discountAmount").value(0.00))
                .andExpect(jsonPath("$[0].discountPercentage").value(0.00))
                .andExpect(jsonPath("$[0].discountPrice").value(99.99))
                .andExpect(jsonPath("$[0].onDeal").value(false))
                .andExpect(jsonPath("$[1].discountAmount").value(20.00))
                .andExpect(jsonPath("$[1].discountPrice").value(79.99))
                .andExpect(jsonPath("$[1].onDeal").value(true))
                .andExpect(jsonPath("$[2].discountPercentage").value(0.15))
                .andExpect(jsonPath("$[2].discountPrice").value(85.00))
                .andExpect(jsonPath("$[2].onDeal").value(true));

        verify(accessoryService).getAllAccessories();
    }

    @Test
    void getAccessoryShouldReturnAccessoryWithDiscountFields() throws Exception {
        UUID accessoryId = UUID.randomUUID();
        AccessoryDto accessoryDto = createAccessoryDtoWithDiscountAmount();

        when(accessoryService.getAccessoryById(accessoryId)).thenReturn(accessoryDto);

        mockMvc.perform(get("/api/v1/accessories/{id}", accessoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(accessoryDto.getName()))
                .andExpect(jsonPath("$.price").value(accessoryDto.getPrice()))
                .andExpect(jsonPath("$.discountAmount").value(accessoryDto.getDiscountAmount()))
                .andExpect(jsonPath("$.discountPercentage").value(accessoryDto.getDiscountPercentage()))
                .andExpect(jsonPath("$.discountPrice").value(accessoryDto.getDiscountPrice()))
                .andExpect(jsonPath("$.onDeal").value(accessoryDto.getOnDeal()));

        verify(accessoryService).getAccessoryById(accessoryId);
    }

    // Helper methods for creating test data
    private AccessoryDto createSampleAccessoryDto() {
        return AccessoryDto.builder()
                .id(UUID.randomUUID())
                .name("Test Accessory")
                .description("Test description")
                .price(new BigDecimal("99.99"))
                .discountAmount(new BigDecimal("0.00"))
                .discountPercentage(new BigDecimal("0.00"))
                .discountPrice(new BigDecimal("99.99"))
                .onDeal(false)
                .quantity(10)
                .build();
    }

    private AccessoryRequestDto createSampleAccessoryRequestDto() {
        return AccessoryRequestDto.builder()
                .name("Test Accessory")
                .description("Test description")
                .price(new BigDecimal("99.99"))
                .discountAmount(new BigDecimal("0.00"))
                .discountPercentage(new BigDecimal("0.00"))
                .quantity(10)
                .build();
    }

    private AccessoryDto createAccessoryDtoWithDiscountAmount() {
        return AccessoryDto.builder()
                .id(UUID.randomUUID())
                .name("Test Accessory with Discount Amount")
                .description("Test description")
                .price(new BigDecimal("99.99"))
                .discountAmount(new BigDecimal("20.00"))
                .discountPercentage(new BigDecimal("0.00"))
                .discountPrice(new BigDecimal("79.99"))
                .onDeal(true)
                .quantity(10)
                .build();
    }

    private AccessoryRequestDto createAccessoryRequestDtoWithDiscountAmount() {
        return AccessoryRequestDto.builder()
                .name("Test Accessory with Discount Amount")
                .description("Test description")
                .price(new BigDecimal("99.99"))
                .discountAmount(new BigDecimal("20.00"))
                .discountPercentage(new BigDecimal("0.00"))
                .quantity(10)
                .build();
    }

    private AccessoryDto createAccessoryDtoWithDiscountPercentage() {
        return AccessoryDto.builder()
                .id(UUID.randomUUID())
                .name("Test Accessory with Discount Percentage")
                .description("Test description")
                .price(new BigDecimal("100.00"))
                .discountAmount(new BigDecimal("0.00"))
                .discountPercentage(new BigDecimal("0.15"))
                .discountPrice(new BigDecimal("85.00"))
                .onDeal(true)
                .quantity(10)
                .build();
    }

    private AccessoryRequestDto createAccessoryRequestDtoWithDiscountPercentage() {
        return AccessoryRequestDto.builder()
                .name("Test Accessory with Discount Percentage")
                .description("Test description")
                .price(new BigDecimal("100.00"))
                .discountAmount(new BigDecimal("0.00"))
                .discountPercentage(new BigDecimal("0.15"))
                .quantity(10)
                .build();
    }

    private AccessoryRequestDto createAccessoryRequestDtoWithBothDiscounts() {
        return AccessoryRequestDto.builder()
                .name("Test Accessory with Both Discounts")
                .description("Test description")
                .price(new BigDecimal("100.00"))
                .discountAmount(new BigDecimal("20.00"))
                .discountPercentage(new BigDecimal("0.15"))
                .quantity(10)
                .build();
    }
}