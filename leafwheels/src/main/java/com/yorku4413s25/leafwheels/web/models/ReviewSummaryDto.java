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
    private Make make; //vehicle make
    private String model; //vehicle model
    private BigDecimal averageRating; //average rating e.g. 4.2
    private int totalReviews; //total number of reviews e.g. 47
    private Map<Integer, Integer> starRatingCounts; //star distribution {5: 23, 4: 15, 3: 6, 2: 2, 1: 1}
    private List<ReviewDto> individualReviews; //all individual reviews with comments and ratings
}