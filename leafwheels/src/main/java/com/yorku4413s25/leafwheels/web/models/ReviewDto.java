package com.yorku4413s25.leafwheels.web.models;
import com.yorku4413s25.leafwheels.constants.Make;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.UUID;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ReviewDto {
    private UUID reviewId;
    
    @NotNull(message = "User ID is required")
    private UUID userId;
    
    @NotNull(message = "Make is required")
    private Make make;
    
    @NotNull(message = "Model is required")  
    private String model;
    
    private String comment;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;
    
    private Instant createdAt;

}
