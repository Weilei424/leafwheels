package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.Make;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryDto {
    private Make make;
    private String model;
    private BigDecimal averageRating;
    private int totalReviews;
    private Map<Integer, Integer> starRatingCounts;
    private List<ReviewDto> individualReviews;
}
