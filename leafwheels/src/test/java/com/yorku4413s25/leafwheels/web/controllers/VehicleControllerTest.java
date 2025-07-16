package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.exception.ApplicationExceptionHandler;
import com.yorku4413s25.leafwheels.services.VehicleService;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import com.yorku4413s25.leafwheels.web.models.VehicleRequestDto;
import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class VehicleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VehicleService vehicleService;

    private VehicleController vehicleController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleController = new VehicleController(vehicleService);
        mockMvc = MockMvcBuilders.standaloneSetup(vehicleController)
                .setControllerAdvice(new ApplicationExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void findVehicleByIdShouldReturnVehicleWhenVehicleExists() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleDto vehicleDto = createSampleVehicleDto();
        
        when(vehicleService.getById(vehicleId)).thenReturn(vehicleDto);

        mockMvc.perform(get("/api/v1/vehicle/{vehicleId}", vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value(vehicleDto.getMake().toString()))
                .andExpect(jsonPath("$.model").value(vehicleDto.getModel()))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.vehicleHistories").isArray())
                .andExpect(jsonPath("$.vehicleHistories.length()").value(1));

        verify(vehicleService).getById(vehicleId);
    }

    @Test
    void createVehicleShouldReturnCreatedVehicleWhenValidInput() throws Exception {
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());
        createdDto.setDiscountPercentage(BigDecimal.ZERO);
        createdDto.setDiscountAmount(BigDecimal.ZERO);
        createdDto.setDiscountPrice(createdDto.getPrice());
        createdDto.setOnDeal(false);

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()))
                .andExpect(jsonPath("$.discountPercentage").value(0.0))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(50000))
                .andExpect(jsonPath("$.onDeal").value(false));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void updateVehicleByIdShouldReturnUpdatedVehicleWhenValidInput() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        VehicleDto updatedDto = createSampleVehicleDto();
        updatedDto.setId(vehicleId);
        updatedDto.setDiscountPercentage(BigDecimal.ZERO);
        updatedDto.setDiscountAmount(BigDecimal.ZERO);
        updatedDto.setDiscountPrice(updatedDto.getPrice());
        updatedDto.setOnDeal(false);

        when(vehicleService.updateById(eq(vehicleId), any(VehicleDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/vehicle/{vehicleId}", vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()))
                .andExpect(jsonPath("$.discountPercentage").value(0.0))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(50000))
                .andExpect(jsonPath("$.onDeal").value(false));

        verify(vehicleService).updateById(eq(vehicleId), any(VehicleDto.class));
    }

    @Test
    void deleteVehicleByIdShouldReturnNoContentWhenVehicleExists() throws Exception {
        UUID vehicleId = UUID.randomUUID();

        doNothing().when(vehicleService).delete(vehicleId);

        mockMvc.perform(delete("/api/v1/vehicle/{vehicleId}", vehicleId))
                .andExpect(status().isNoContent());

        verify(vehicleService).delete(vehicleId);
    }

    @Test
    void getAllVehiclesShouldReturnListOfVehicles() throws Exception {
        List<VehicleDto> vehicles = Arrays.asList(createSampleVehicleDto(), createSampleVehicleDto());

        when(vehicleService.getAllVehicles()).thenReturn(vehicles);

        mockMvc.perform(get("/api/v1/vehicle/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(vehicleService).getAllVehicles();
    }

    @Test
    void addImageUrlsShouldReturnUpdatedVehicleWhenValidInput() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        List<String> imageUrls = Arrays.asList("https://example.com/image1.jpg", "https://example.com/image2.jpg");
        VehicleDto updatedVehicle = createSampleVehicleDto();
        updatedVehicle.setId(vehicleId);
        updatedVehicle.setImageUrls(imageUrls);

        when(vehicleService.addImageUrls(vehicleId, imageUrls)).thenReturn(updatedVehicle);

        mockMvc.perform(post("/api/v1/vehicle/{vehicleId}/images", vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(imageUrls)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls.length()").value(2))
                .andExpect(jsonPath("$.imageUrls[0]").value("https://example.com/image1.jpg"));

        verify(vehicleService).addImageUrls(vehicleId, imageUrls);
    }

    @Test
    void createVehicleWithDiscountShouldReturnVehicleWithCalculatedDiscountPrice() throws Exception {
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(new BigDecimal("0.15")); // 15% discount
        
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());
        createdDto.setDiscountPercentage(new BigDecimal("0.15"));
        createdDto.setDiscountAmount(BigDecimal.ZERO);
        createdDto.setDiscountPrice(new BigDecimal("42500.00")); // 50000 * (1 - 0.15)
        createdDto.setOnDeal(true);

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.15))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(42500.0))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void createVehicleWithoutDiscountShouldDefaultToNoDiscount() throws Exception {
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(null); // No discount specified
        
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());
        createdDto.setDiscountPercentage(BigDecimal.ZERO);
        createdDto.setDiscountAmount(BigDecimal.ZERO);
        createdDto.setDiscountPrice(new BigDecimal("50000"));
        createdDto.setOnDeal(false);

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.0))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(50000))
                .andExpect(jsonPath("$.onDeal").value(false));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void updateVehicleWithDiscountShouldReturnUpdatedVehicleWithCalculatedDiscountPrice() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(new BigDecimal("0.10")); // 10% discount
        
        VehicleDto updatedDto = createSampleVehicleDto();
        updatedDto.setId(vehicleId);
        updatedDto.setDiscountPercentage(new BigDecimal("0.10"));
        updatedDto.setDiscountAmount(BigDecimal.ZERO);
        updatedDto.setDiscountPrice(new BigDecimal("45000.00")); // 50000 * (1 - 0.10)
        updatedDto.setOnDeal(true);

        when(vehicleService.updateById(eq(vehicleId), any(VehicleDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/vehicle/{vehicleId}", vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.10))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(45000.0))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(vehicleService).updateById(eq(vehicleId), any(VehicleDto.class));
    }

    @Test
    void createVehicleWithZeroDiscountShouldNotBeOnDeal() throws Exception {
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(BigDecimal.ZERO); // 0% discount
        
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());
        createdDto.setDiscountPercentage(BigDecimal.ZERO);
        createdDto.setDiscountAmount(BigDecimal.ZERO);
        createdDto.setDiscountPrice(new BigDecimal("50000.00")); // 50000 * (1 - 0.0)
        createdDto.setOnDeal(false);

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.0))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(50000.0))
                .andExpect(jsonPath("$.onDeal").value(false));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void createVehicleWithMaxDiscountShouldCalculateCorrectly() throws Exception {
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(new BigDecimal("0.50")); // 50% discount
        
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());
        createdDto.setDiscountPercentage(new BigDecimal("0.50"));
        createdDto.setDiscountAmount(BigDecimal.ZERO);
        createdDto.setDiscountPrice(new BigDecimal("25000.00")); // 50000 * (1 - 0.50)
        createdDto.setOnDeal(true);

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.50))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(25000.0))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void updateVehicleWithSmallDiscountShouldCalculateCorrectly() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleRequestDto inputDto = createSampleVehicleRequestDto();
        inputDto.setDiscountPercentage(new BigDecimal("0.05")); // 5% discount
        
        VehicleDto updatedDto = createSampleVehicleDto();
        updatedDto.setId(vehicleId);
        updatedDto.setDiscountPercentage(new BigDecimal("0.05"));
        updatedDto.setDiscountAmount(BigDecimal.ZERO);
        updatedDto.setDiscountPrice(new BigDecimal("47500.00")); // 50000 * (1 - 0.05)
        updatedDto.setOnDeal(true);

        when(vehicleService.updateById(eq(vehicleId), any(VehicleDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/vehicle/{vehicleId}", vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()))
                .andExpect(jsonPath("$.price").value(50000))
                .andExpect(jsonPath("$.discountPercentage").value(0.05))
                .andExpect(jsonPath("$.discountAmount").value(0.0))
                .andExpect(jsonPath("$.discountPrice").value(47500.0))
                .andExpect(jsonPath("$.onDeal").value(true));

        verify(vehicleService).updateById(eq(vehicleId), any(VehicleDto.class));
    }

    private VehicleDto createSampleVehicleDto() {
        return VehicleDto.builder()
                .make(Make.TESLA)
                .model("Model 3")
                .year(2023)
                .bodyType(BodyType.SEDAN)
                .exteriorColor("White")
                .doors(4)
                .seats(5)
                .price(new BigDecimal("50000"))
                .discountPercentage(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .discountPrice(new BigDecimal("50000"))
                .onDeal(false)
                .condition(Condition.NEW)
                .status(VehicleStatus.AVAILABLE)
                .vin("TEST123456789")
                .vehicleHistories(Arrays.asList(createSampleVehicleHistoryDto()))
                .build();
    }

    private VehicleRequestDto createSampleVehicleRequestDto() {
        return VehicleRequestDto.builder()
                .make(Make.TESLA)
                .model("Model 3")
                .year(2023)
                .bodyType(BodyType.SEDAN)
                .exteriorColor("White")
                .doors(4)
                .seats(5)
                .price(new BigDecimal("50000"))
                .discountPercentage(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .condition(Condition.NEW)
                .status(VehicleStatus.AVAILABLE)
                .vin("TEST123456789")
                .build();
    }

    private VehicleHistoryDto createSampleVehicleHistoryDto() {
        return VehicleHistoryDto.builder()
                .id(UUID.randomUUID())
                .accidentDate(Instant.now())
                .repairCost(new BigDecimal("2500.00"))
                .accidentDescription("Minor fender bender")
                .vehicleId(UUID.randomUUID())
                .build();
    }
}
