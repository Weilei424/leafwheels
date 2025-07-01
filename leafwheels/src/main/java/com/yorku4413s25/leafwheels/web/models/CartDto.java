package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {
    private UUID id;
    private UUID userId;
    private List<CartItemDto> items;
}
