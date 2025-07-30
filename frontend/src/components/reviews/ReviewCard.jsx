import { useState } from "react";
import StarRating from "./StarRating.jsx";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore.js"; // ✅ Add this import

const ReviewCard = ({ review, canDelete = false, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUserStore();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;



    setIsDeleting(true);
    try {
      // ✅ Use reviewId instead of id
      await onDelete(review.reviewId);
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
      setIsDeleting(false);
    }
  };





  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            </div>
            <h4 className="font-medium text-gray-900">{review.title}</h4>
            <p className="text-sm text-gray-600">by {"Anonymous"}</p>
          </div>

          {canDelete && (
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 p-1"
              >
                <img className="w-9 h-7" src="/delete.png" alt="Loading" />
              </motion.button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{review.comment}</p>

        {review.recommend && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Recommends this vehicle
            </div>
        )}
      </motion.div>
  );
};

export default ReviewCard;