package com.yorku4413s25.leafwheels.web.models;
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
    private int rating; // constrained to 1-5 stars

}
