package com.yorku4413s25.leafwheels.web.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRequestDto {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}