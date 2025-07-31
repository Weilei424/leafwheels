package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.web.models.ReviewDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewDto reviewToReviewDto(Review review);
    Review reviewDtoToReview(ReviewDto dto);
    void updateReviewFromDto(ReviewDto dto, @MappingTarget Review review);
    
    @Mapping(source = "review.reviewId", target = "reviewId")
    @Mapping(source = "review.userId", target = "userId")
    @Mapping(source = "review.make", target = "make")
    @Mapping(source = "review.model", target = "model")
    @Mapping(source = "review.comment", target = "comment")
    @Mapping(source = "review.rating", target = "rating")
    @Mapping(source = "review.createdAt", target = "createdAt")
    @Mapping(source = "user.firstName", target = "userFirstName")
    @Mapping(source = "user.lastName", target = "userLastName")
    ReviewDto reviewWithUserToReviewDto(Review review, User user);
}
