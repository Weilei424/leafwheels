package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yorku4413s25.leafwheels.services.VehicleHistoryService;
import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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

class VehicleHistoryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VehicleHistoryService vehicleHistoryService;

    private VehicleHistoryController vehicleHistoryController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleHistoryController = new VehicleHistoryController(vehicleHistoryService);
        mockMvc = MockMvcBuilders.standaloneSetup(vehicleHistoryController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void findVehicleHistoryByIdShouldReturnVehicleHistoryWhenExists() throws Exception {
        UUID vehicleHistoryId = UUID.randomUUID();
        VehicleHistoryDto vehicleHistoryDto = createSampleVehicleHistoryDto();
        
        when(vehicleHistoryService.getById(vehicleHistoryId)).thenReturn(vehicleHistoryDto);

        mockMvc.perform(get("/api/v1/vehiclehistory/{vehicleHistoryId}", vehicleHistoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accidentDescription").value(vehicleHistoryDto.getAccidentDescription()))
                .andExpect(jsonPath("$.repairCost").value(2500.0))
                .andExpect(jsonPath("$.vehicleId").value(vehicleHistoryDto.getVehicleId().toString()));

        verify(vehicleHistoryService).getById(vehicleHistoryId);
    }

    @Test
    void createVehicleHistoryShouldReturnCreatedVehicleHistoryWhenValidInput() throws Exception {
        VehicleHistoryDto inputDto = createSampleVehicleHistoryDto();
        VehicleHistoryDto createdDto = createSampleVehicleHistoryDto();
        createdDto.setId(UUID.randomUUID());

        when(vehicleHistoryService.create(any(VehicleHistoryDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/vehiclehistory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accidentDescription").value(createdDto.getAccidentDescription()));

        verify(vehicleHistoryService).create(any(VehicleHistoryDto.class));
    }

    @Test
    void updateVehicleHistoryByIdShouldReturnUpdatedVehicleHistoryWhenValidInput() throws Exception {
        UUID vehicleHistoryId = UUID.randomUUID();
        VehicleHistoryDto inputDto = createSampleVehicleHistoryDto();
        VehicleHistoryDto updatedDto = createSampleVehicleHistoryDto();
        updatedDto.setId(vehicleHistoryId);

        when(vehicleHistoryService.updateById(eq(vehicleHistoryId), any(VehicleHistoryDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/v1/vehiclehistory/{vehicleHistoryId}", vehicleHistoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleHistoryId.toString()));

        verify(vehicleHistoryService).updateById(eq(vehicleHistoryId), any(VehicleHistoryDto.class));
    }

    @Test
    void deleteVehicleHistoryByIdShouldReturnNoContentWhenVehicleHistoryExists() throws Exception {
        UUID vehicleHistoryId = UUID.randomUUID();

        doNothing().when(vehicleHistoryService).delete(vehicleHistoryId);

        mockMvc.perform(delete("/api/v1/vehiclehistory/{vehicleHistoryId}", vehicleHistoryId))
                .andExpect(status().isNoContent());

        verify(vehicleHistoryService).delete(vehicleHistoryId);
    }

    @Test
    void getVehicleHistoryByVehicleIdShouldReturnListOfVehicleHistories() throws Exception {
        UUID vehicleId = UUID.randomUUID();
        List<VehicleHistoryDto> vehicleHistories = Arrays.asList(
                createSampleVehicleHistoryDto(), 
                createSampleVehicleHistoryDto()
        );

        when(vehicleHistoryService.getByVehicleId(vehicleId)).thenReturn(vehicleHistories);

        mockMvc.perform(get("/api/v1/vehiclehistory/vehicle/{vehicleId}", vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(vehicleHistoryService).getByVehicleId(vehicleId);
    }

    private VehicleHistoryDto createSampleVehicleHistoryDto() {
        return VehicleHistoryDto.builder()
                .accidentDate(Instant.now())
                .repairCost(new BigDecimal("2500.00"))
                .accidentDescription("Minor fender bender")
                .vehicleId(UUID.randomUUID())
                .build();
    }
}