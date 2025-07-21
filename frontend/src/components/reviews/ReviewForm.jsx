import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore.js";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import StarRating from "./StarRating";

const ReviewForm = ({ make, model, onSuccess }) => {
  const { user } = useUserStore();
  const { createReview, loading } = useReviewStore();

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    recommend: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createReview({
        userId: user.id,
        make: make.toUpperCase(),
        model: model,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        recommend: formData.recommend
      });

      setFormData({ rating: 0, title: "", comment: "", recommend: true });
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  if (!user) {
    return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in to write a review</p>
          <button
              onClick={() => window.location.href = "/login"}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </div>
    );
  }

  return (
      <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6"
      >
        <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Summarize your experience"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Share your experience with this vehicle"
          />
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={formData.recommend}
                onChange={(e) => setFormData(prev => ({ ...prev, recommend: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">I would recommend this vehicle</span>
          </label>
        </div>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || formData.rating === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </motion.button>
      </motion.form>
  );
};

export default ReviewForm;
