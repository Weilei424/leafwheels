package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.ReviewService;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Review API", description = "Endpoints for managing reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Create a review", description = "Submit a new review for a vehicle by a user.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Review created",
                    content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto dto) {
        ReviewDto created = reviewService.createReview(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all reviews", description = "Retrieve all reviews in the system.")
    @ApiResponse(responseCode = "200", description = "List of reviews",
            content = @Content(schema = @Schema(implementation = ReviewDto.class)))
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @Operation(summary = "Get reviews by user", description = "Retrieve all reviews submitted by a specific user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of user reviews",
                    content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDto>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @Operation(summary = "Get reviews by vehicle", description = "Retrieve all reviews for a specific vehicle.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of vehicle reviews",
                    content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReviewDto>> getByVehicle(@PathVariable UUID vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicleId(vehicleId));
    }

    @Operation(summary = "Delete a review", description = "Remove a review by its ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Review deleted"),
            @ApiResponse(responseCode = "404", description = "Review not found", content = @Content)
    })
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
