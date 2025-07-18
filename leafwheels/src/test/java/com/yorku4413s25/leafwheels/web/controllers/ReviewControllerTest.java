package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.exception.ApplicationExceptionHandler;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.services.ReviewService;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import com.yorku4413s25.leafwheels.web.models.ReviewSummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReviewService reviewService;

    private ReviewController reviewController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reviewController = new ReviewController(reviewService);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController)
                .setControllerAdvice(new ApplicationExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    // ===== CRUD OPERATION TESTS =====

    @Test
    void createReviewShouldReturnCreatedReviewWhenValidInput() throws Exception {
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setReviewId(null); // Input should not have ID
        
        ReviewDto createdDto = createSampleReviewDto();
        createdDto.setReviewId(UUID.randomUUID()); // Service returns with ID
        createdDto.setCreatedAt(Instant.now());

        when(reviewService.createReview(any(ReviewDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reviewId").value(createdDto.getReviewId().toString()))
                .andExpect(jsonPath("$.userId").value(createdDto.getUserId().toString()))
                .andExpect(jsonPath("$.make").value("TESLA"))
                .andExpect(jsonPath("$.model").value("Model 3"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Excellent electric vehicle!"));

        verify(reviewService).createReview(any(ReviewDto.class));
    }

    @Test
    void getAllReviewsShouldReturnListOfReviews() throws Exception {
        List<ReviewDto> reviews = Arrays.asList(
                createSampleReviewDto(),
                createAnotherSampleReviewDto()
        );

        when(reviewService.getAllReviews()).thenReturn(reviews);

        mockMvc.perform(get("/api/v1/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].rating").value(5))
                .andExpect(jsonPath("$[1].rating").value(3));

        verify(reviewService).getAllReviews();
    }

    @Test
    void getReviewsByUserShouldReturnUserReviews() throws Exception {
        UUID userId = UUID.randomUUID();
        List<ReviewDto> userReviews = Arrays.asList(createSampleReviewDto());

        when(reviewService.getReviewsByUserId(userId)).thenReturn(userReviews);

        mockMvc.perform(get("/api/v1/reviews/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].userId").value(userReviews.get(0).getUserId().toString()));

        verify(reviewService).getReviewsByUserId(userId);
    }

    @Test
    void getReviewsByMakeAndModelShouldReturnMakeModelReviews() throws Exception {
        Make make = Make.TESLA;
        String model = "Model 3";
        List<ReviewDto> makeModelReviews = Arrays.asList(
                createSampleReviewDto(),
                createAnotherSampleReviewDto()
        );

        when(reviewService.getReviewsByMakeAndModel(make, model)).thenReturn(makeModelReviews);

        mockMvc.perform(get("/api/v1/reviews/make/{make}/model/{model}", make, model))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].make").value("TESLA"))
                .andExpect(jsonPath("$[0].model").value("Model 3"));

        verify(reviewService).getReviewsByMakeAndModel(make, model);
    }

    @Test
    void getReviewSummaryShouldReturnComprehensiveReviewData() throws Exception {
        Make make = Make.TESLA;
        String model = "Model 3";
        ReviewSummaryDto summaryDto = createSampleReviewSummaryDto();

        when(reviewService.getReviewSummary(make, model)).thenReturn(summaryDto);

        mockMvc.perform(get("/api/v1/reviews/make/{make}/model/{model}/summary", make, model))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("TESLA"))
                .andExpect(jsonPath("$.model").value("Model 3"))
                .andExpect(jsonPath("$.averageRating").value(4.2))
                .andExpect(jsonPath("$.totalReviews").value(5))
                .andExpect(jsonPath("$.starRatingCounts.5").value(2))
                .andExpect(jsonPath("$.starRatingCounts.4").value(2))
                .andExpect(jsonPath("$.starRatingCounts.3").value(1))
                .andExpect(jsonPath("$.individualReviews.length()").value(2));

        verify(reviewService).getReviewSummary(make, model);
    }

    @Test
    void deleteReviewShouldReturnNoContentWhenReviewExists() throws Exception {
        UUID reviewId = UUID.randomUUID();

        doNothing().when(reviewService).deleteReview(reviewId);

        mockMvc.perform(delete("/api/v1/reviews/{reviewId}", reviewId))
                .andExpect(status().isNoContent());

        verify(reviewService).deleteReview(reviewId);
    }

    // ===== BUSINESS LOGIC TESTS =====

    @Test
    void createReviewShouldReturn400WhenDuplicateReview() throws Exception {
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setReviewId(null);

        when(reviewService.createReview(any(ReviewDto.class)))
                .thenThrow(new IllegalArgumentException("User has already reviewed this make/model combination"));

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest()); // IllegalArgumentException now handled as 400

        verify(reviewService).createReview(any(ReviewDto.class));
    }

    @Test
    void createReviewShouldRejectInvalidRating() throws Exception {
        // With validation framework active, invalid ratings should be rejected
        
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setRating(0); // Invalid rating (must be 1-5)
        inputDto.setReviewId(null);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());

        verify(reviewService, never()).createReview(any(ReviewDto.class));
    }

    @Test
    void createReviewShouldRejectNullRequiredFields() throws Exception {
        // With validation framework active, null required fields should be rejected
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setUserId(null); // Required field
        inputDto.setMake(null); // Required field
        inputDto.setModel(null); // Required field
        inputDto.setReviewId(null);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest());

        verify(reviewService, never()).createReview(any(ReviewDto.class));
    }

    @Test
    void createReviewShouldAcceptValidRatingBoundaries() throws Exception {
        // Test rating = 1
        ReviewDto inputDto1 = createSampleReviewDto();
        inputDto1.setRating(1);
        inputDto1.setReviewId(null);
        
        ReviewDto createdDto1 = createSampleReviewDto();
        createdDto1.setRating(1);
        createdDto1.setReviewId(UUID.randomUUID());
        createdDto1.setCreatedAt(Instant.now());

        when(reviewService.createReview(any(ReviewDto.class))).thenReturn(createdDto1);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(1));

        // Test rating = 5
        ReviewDto inputDto5 = createSampleReviewDto();
        inputDto5.setRating(5);
        inputDto5.setReviewId(null);
        
        ReviewDto createdDto5 = createSampleReviewDto();
        createdDto5.setRating(5);
        createdDto5.setReviewId(UUID.randomUUID());
        createdDto5.setCreatedAt(Instant.now());

        when(reviewService.createReview(any(ReviewDto.class))).thenReturn(createdDto5);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto5)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(5));

        verify(reviewService, times(2)).createReview(any(ReviewDto.class));
    }

    @Test
    void createReviewShouldAcceptNullComment() throws Exception {
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setComment(null); // Comment is optional
        inputDto.setReviewId(null);
        
        ReviewDto createdDto = createSampleReviewDto();
        createdDto.setComment(null);
        createdDto.setReviewId(UUID.randomUUID());
        createdDto.setCreatedAt(Instant.now());

        when(reviewService.createReview(any(ReviewDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.comment").doesNotExist());

        verify(reviewService).createReview(any(ReviewDto.class));
    }

    @Test
    void deleteReviewShouldReturn404WhenReviewNotFound() throws Exception {
        UUID reviewId = UUID.randomUUID();

        doThrow(new EntityNotFoundException(reviewId, Review.class)).when(reviewService).deleteReview(reviewId);

        mockMvc.perform(delete("/api/v1/reviews/{reviewId}", reviewId))
                .andExpect(status().isNotFound());

        verify(reviewService).deleteReview(reviewId);
    }

    @Test
    void getReviewSummaryShouldReturnEmptyWhenNoReviews() throws Exception {
        Make make = Make.TESLA;
        String model = "Model 3";
        ReviewSummaryDto emptyDto = ReviewSummaryDto.builder()
                .make(make)
                .model(model)
                .averageRating(BigDecimal.ZERO)
                .totalReviews(0)
                .starRatingCounts(createEmptyStarCounts())
                .individualReviews(Arrays.asList())
                .build();

        when(reviewService.getReviewSummary(make, model)).thenReturn(emptyDto);

        mockMvc.perform(get("/api/v1/reviews/make/{make}/model/{model}/summary", make, model))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(0))
                .andExpect(jsonPath("$.totalReviews").value(0))
                .andExpect(jsonPath("$.individualReviews.length()").value(0));

        verify(reviewService).getReviewSummary(make, model);
    }

    @Test
    void createReviewShouldHandleLongComment() throws Exception {
        ReviewDto inputDto = createSampleReviewDto();
        inputDto.setComment("This is a very long comment that tests the character limit functionality. " +
                "The system should handle longer comments gracefully within the database constraints. " +
                "This particular comment is designed to test how the system handles realistic user feedback " +
                "that might be more detailed than typical short reviews. Users often want to provide comprehensive " +
                "feedback about their experience with electric vehicles, including details about performance, " +
                "charging experience, build quality, and overall satisfaction.");
        inputDto.setReviewId(null);
        
        ReviewDto createdDto = createSampleReviewDto();
        createdDto.setComment(inputDto.getComment());
        createdDto.setReviewId(UUID.randomUUID());
        createdDto.setCreatedAt(Instant.now());

        when(reviewService.createReview(any(ReviewDto.class))).thenReturn(createdDto);

        mockMvc.perform(post("/api/v1/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.comment").value(inputDto.getComment()));

        verify(reviewService).createReview(any(ReviewDto.class));
    }

    // ===== HELPER METHODS =====

    private ReviewDto createSampleReviewDto() {
        return ReviewDto.builder()
                .reviewId(UUID.randomUUID())
                .userId(UUID.randomUUID())
                .make(Make.TESLA)
                .model("Model 3")
                .rating(5)
                .comment("Excellent electric vehicle!")
                .createdAt(Instant.now())
                .build();
    }

    private ReviewDto createAnotherSampleReviewDto() {
        return ReviewDto.builder()
                .reviewId(UUID.randomUUID())
                .userId(UUID.randomUUID())
                .make(Make.TESLA)
                .model("Model 3")
                .rating(3)
                .comment("Average performance, could be better.")
                .createdAt(Instant.now())
                .build();
    }

    private ReviewSummaryDto createSampleReviewSummaryDto() {
        Map<Integer, Integer> starCounts = new HashMap<>();
        starCounts.put(1, 0);
        starCounts.put(2, 0);
        starCounts.put(3, 1);
        starCounts.put(4, 2);
        starCounts.put(5, 2);

        return ReviewSummaryDto.builder()
                .make(Make.TESLA)
                .model("Model 3")
                .averageRating(BigDecimal.valueOf(4.2))
                .totalReviews(5)
                .starRatingCounts(starCounts)
                .individualReviews(Arrays.asList(
                        createSampleReviewDto(),
                        createAnotherSampleReviewDto()
                ))
                .build();
    }

    private Map<Integer, Integer> createEmptyStarCounts() {
        Map<Integer, Integer> starCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            starCounts.put(i, 0);
        }
        return starCounts;
    }
}