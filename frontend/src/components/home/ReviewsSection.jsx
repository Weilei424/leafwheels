import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StarRating } from "../../components/reviews/ReviewComponents.jsx";

const ReviewsSection = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers who love their electric vehicles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {reviews.map((review, index) => (
            <motion.div
              key={
                review.id ? `review-${review.id}` : `review-fallback-${index}`
              }
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {review.comment}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {review.userName || "Anonymous"}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {review.make} {review.model}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/reviews"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            Read All Reviews
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
