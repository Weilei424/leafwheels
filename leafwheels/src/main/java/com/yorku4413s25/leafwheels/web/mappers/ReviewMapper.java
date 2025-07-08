package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewDto reviewToReviewDto(Review review);
    Review reviewDtoToReview(ReviewDto dto);
    void updateReviewFromDto(ReviewDto dto, @MappingTarget Review review);
}
