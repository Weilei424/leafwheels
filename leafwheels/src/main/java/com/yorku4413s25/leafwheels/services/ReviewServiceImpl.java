package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import com.yorku4413s25.leafwheels.web.mappers.ReviewMapper;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import com.yorku4413s25.leafwheels.web.models.ReviewSummaryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewDto createReview(ReviewDto reviewDto) {
        if (reviewRepository.existsByUserIdAndMakeAndModel(
                reviewDto.getUserId(), reviewDto.getMake(), reviewDto.getModel())) {
            throw new IllegalArgumentException("User has already reviewed this make/model combination");
        }
        
        Review review = reviewMapper.reviewDtoToReview(reviewDto);
        Review saved = reviewRepository.save(review);
        return reviewMapper.reviewToReviewDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(reviewMapper::reviewToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByUserId(UUID userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(reviewMapper::reviewToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByMakeAndModel(Make make, String model) {
        return reviewRepository.findByMakeAndModel(make, model).stream()
                .map(reviewMapper::reviewToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryDto getReviewSummary(Make make, String model) {
        List<Review> reviews = reviewRepository.findByMakeAndModel(make, model);
        
        if (reviews.isEmpty()) {
            return ReviewSummaryDto.builder()
                    .make(make)
                    .model(model)
                    .averageRating(BigDecimal.ZERO)
                    .totalReviews(0)
                    .starRatingCounts(initializeStarCounts())
                    .individualReviews(List.of())
                    .build();
        }
        
        return ReviewSummaryDto.builder()
                .make(make)
                .model(model)
                .averageRating(calculateAverageRating(reviews))
                .totalReviews(reviews.size())
                .starRatingCounts(calculateStarRatingCounts(reviews))
                .individualReviews(mapToReviewDtos(reviews))
                .build();
    }

    @Override
    public void deleteReview(UUID reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new EntityNotFoundException(reviewId, Review.class);
        }
        reviewRepository.deleteById(reviewId);
    }
    
    private BigDecimal calculateAverageRating(List<Review> reviews) {
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        return BigDecimal.valueOf(average)
                .setScale(1, RoundingMode.HALF_UP);
    }
    
    private Map<Integer, Integer> calculateStarRatingCounts(List<Review> reviews) {
        Map<Integer, Integer> counts = initializeStarCounts();
        
        reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()))
                .forEach((rating, count) -> counts.put(rating, count.intValue()));
                
        return counts;
    }
    
    private Map<Integer, Integer> initializeStarCounts() {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            counts.put(i, 0);
        }
        return counts;
    }
    
    private List<ReviewDto> mapToReviewDtos(List<Review> reviews) {
        return reviews.stream()
                .map(reviewMapper::reviewToReviewDto)
                .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt())) // Sort by newest first
                .collect(Collectors.toList());
    }
}
