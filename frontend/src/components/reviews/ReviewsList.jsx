import React, { useEffect, useState } from "react";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "./ReviewCard";

const ReviewsList = ({ make, model, title = "Reviews" }) => {
  const { getReviewsByVehicle } = useReviewStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const data = await getReviewsByVehicle(make, model);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [make, model, getReviewsByVehicle]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {loading ? (
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
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
