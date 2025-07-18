package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.Make;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "reviews", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "make", "model"}))
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Review extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID reviewId;

    @NotNull(message = "User ID is required")
    @Column(nullable = false)
    private UUID userId;

    @NotNull(message = "Make is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Make make;

    @NotNull(message = "Model is required")
    @Column(nullable = false, length = 100)
    private String model;

    @Column(length = 500)
    private String comment;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    @Column(nullable = false)
    private int rating;


}
