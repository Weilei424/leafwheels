package com.yorku4413s25.leafwheels.web.models;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ReviewDto {
    private UUID reviewId; //unique review ID
    private UUID userId; //user's connected id
    private UUID vehicleId;
    private String comment;
    
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating; // constrained to 1-5 stars

}
