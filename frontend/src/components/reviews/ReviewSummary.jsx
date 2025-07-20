import React, { useEffect, useState } from "react";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { motion } from "framer-motion";

const ReviewSummary = ({ make, model }) => {
  const { getReviewSummary } = useReviewStore();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getReviewSummary(make, model);
      setSummary(data);
    };
    fetchSummary();
  }, [make, model, getReviewSummary]);

  if (!summary) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-bold text-yellow-400">
          {summary.avgRating.toFixed(1)}
        </span>
        <span className="text-gray-600">/ 5</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < Math.round(summary.avgRating)
                ? "bg-yellow-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ReviewSummary;
