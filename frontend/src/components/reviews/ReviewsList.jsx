import React, { useEffect } from "react";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { AnimatePresence } from "framer-motion";
import { ReviewCard } from "../../components/reviews/ReviewComponents.jsx";
import { useUserStore } from "../../stores/useUserStore.js";

// Reviews List Component
export const ReviewsList = ({ make, model, title = "Reviews" }) => {
  const { makeModelReviews, getReviewsByMakeAndModel, deleteReview, loading } =
    useReviewStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (make && model) {
      getReviewsByMakeAndModel(make, model);
    }
  }, [make, model, getReviewsByMakeAndModel]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (makeModelReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="space-y-4">
        <AnimatePresence>
          {makeModelReviews.map((review, index) => (
              <ReviewCard
                  key={
                    review.reviewId ? `review-${review.reviewId}` : `review-fallback-${index}`
                  }
                  review={review}
                  canDelete={user?.id === review.userId}
                  onDelete={deleteReview}
              />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewsList;
