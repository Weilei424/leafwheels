package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import com.yorku4413s25.leafwheels.web.mappers.ReviewMapper;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewDto createReview(ReviewDto reviewDto) {
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
    public List<ReviewDto> getReviewsByVehicleId(UUID vehicleId) {
        return reviewRepository.findByVehicleId(vehicleId).stream()
                .map(reviewMapper::reviewToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(UUID reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new EntityNotFoundException(reviewId, Review.class);
        }
        reviewRepository.deleteById(reviewId);
    }
}
