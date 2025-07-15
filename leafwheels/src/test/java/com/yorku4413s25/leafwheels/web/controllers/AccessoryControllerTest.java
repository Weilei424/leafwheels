package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
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
        mockMvc = MockMvcBuilders.standaloneSetup(accessoryController).build();
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
        AccessoryDto inputDto = createSampleAccessoryDto();
        AccessoryDto createdDto = createSampleAccessoryDto();

        when(accessoryService.createAccessory(any(AccessoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/accessories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(createdDto.getName()))
                .andExpect(jsonPath("$.price").value(createdDto.getPrice()));

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
        AccessoryDto inputDto = createSampleAccessoryDto();
        AccessoryDto updatedDto = createSampleAccessoryDto();

        when(accessoryService.updateById(eq(accessoryId), any(AccessoryDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/accessories/{id}", accessoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(updatedDto.getName()));

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

    private AccessoryDto createSampleAccessoryDto() {
        return AccessoryDto.builder()
                .id(UUID.randomUUID())
                .name("Test Accessory")
                .description("Test description")
                .price(new BigDecimal("99.99"))
                .quantity(10)
                .build();
    }
}