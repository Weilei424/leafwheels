package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import com.yorku4413s25.leafwheels.web.models.ReviewSummaryDto;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDto createReview(ReviewDto reviewDto);
    List<ReviewDto> getAllReviews();
    List<ReviewDto> getReviewsByUserId(UUID userId);
    List<ReviewDto> getReviewsByMakeAndModel(Make make, String model);
    ReviewSummaryDto getReviewSummary(Make make, String model);
    void deleteReview(UUID reviewId);
}
