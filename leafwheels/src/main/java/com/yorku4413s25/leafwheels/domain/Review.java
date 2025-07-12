package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.ItemType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Review extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID reviewId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID vehicleId;

    @Column(length = 500)
    private String comment;

    @Column(nullable = false)
    private int rating;


}
