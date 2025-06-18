package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.Vehicle}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleDto  {
    UUID id;
}
