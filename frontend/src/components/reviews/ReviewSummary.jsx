import React, { useEffect } from "react";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { motion } from "framer-motion";
import StarRating from "./StarRating.jsx";

export const ReviewSummary = ({ make, model }) => {
  const { currentReviewSummary, getReviewSummary, loading } = useReviewStore();


  useEffect(() => {
    if (make && model) {
      getReviewSummary(make, model);
    }
  }, [make, model, getReviewSummary]);

  if (loading || !currentReviewSummary) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-light text-gray-900">
            {currentReviewSummary.averageRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={Math.round(currentReviewSummary.averageRating)} readonly />
            <p className="text-sm text-gray-600 mt-1">
              Based on {currentReviewSummary.totalReviews} review{currentReviewSummary.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {currentReviewSummary.recommendationRate > 0 && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {Math.round(currentReviewSummary.recommendationRate * 100)}% would recommend
            </div>
        )}
      </motion.div>
  );
};

export default ReviewSummary;
