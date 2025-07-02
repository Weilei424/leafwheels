package com.yorku4413s25.leafwheels.web.models;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequestDto {

    @NonNull
    private UUID userId;

    private List<CreateOrderItemDto> items;
}
