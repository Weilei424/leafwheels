package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.services.VehicleService;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
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
        mockMvc = MockMvcBuilders.standaloneSetup(vehicleController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void findVehicleByIdShouldReturnVehicleWhenVehicleExists() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleDto vehicleDto = createSampleVehicleDto();
        
        when(vehicleService.getById(vehicleId)).thenReturn(vehicleDto);

        mockMvc.perform(get("/api/v1/vehicle/{vehicleId}", vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value(vehicleDto.getMake().toString()))
                .andExpect(jsonPath("$.model").value(vehicleDto.getModel()));

        verify(vehicleService).getById(vehicleId);
    }

    @Test
    void createVehicleShouldReturnCreatedVehicleWhenValidInput() throws Exception {
        VehicleDto inputDto = createSampleVehicleDto();
        VehicleDto createdDto = createSampleVehicleDto();
        createdDto.setId(UUID.randomUUID());

        when(vehicleService.create(any(VehicleDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehicle")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value(createdDto.getMake().toString()));

        verify(vehicleService).create(any(VehicleDto.class));
    }

    @Test
    void updateVehicleByIdShouldReturnUpdatedVehicleWhenValidInput() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        VehicleDto inputDto = createSampleVehicleDto();
        VehicleDto updatedDto = createSampleVehicleDto();
        updatedDto.setId(vehicleId);

        when(vehicleService.updateById(eq(vehicleId), any(VehicleDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/vehicle/{vehicleId}", vehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()));

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
                .condition(Condition.NEW)
                .status(VehicleStatus.AVAILABLE)
                .vin("TEST123456789")
                .build();
    }
}
