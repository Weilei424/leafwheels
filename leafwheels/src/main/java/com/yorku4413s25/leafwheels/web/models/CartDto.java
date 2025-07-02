package com.yorku4413s25.leafwheels.web.models;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {

    @NonNull
    private UUID id;

    @NonNull
    private UUID userId;

    private List<CartItemDto> items;
}
