package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.ReviewDto;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDto createReview(ReviewDto reviewDto);
    List<ReviewDto> getAllReviews();
    List<ReviewDto> getReviewsByUserId(UUID userId);
    List<ReviewDto> getReviewsByVehicleId(UUID vehicleId);
    void deleteReview(UUID reviewId);
}
