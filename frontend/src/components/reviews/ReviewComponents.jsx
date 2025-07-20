import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { useUserStore } from "../../stores/useUserStore.js";

// Star Rating Component
export const StarRating = ({ rating, onRatingChange, readonly = false, size = "md" }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    whileHover={!readonly ? { scale: 1.1 } : {}}
                    whileTap={!readonly ? { scale: 0.95 } : {}}
                    onClick={() => !readonly && onRatingChange && onRatingChange(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    disabled={readonly}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
                >
                    <svg
                        className={`${sizeClasses[size]} ${
                            star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                </motion.button>
            ))}
        </div>
    );
};

// Review Form Component
export const ReviewForm = ({ make, model, onSuccess }) => {
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

// Review Card Component
export const ReviewCard = ({ review, canDelete = false, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        setIsDeleting(true);
        try {
            await onDelete(review.id);
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
                    <p className="text-sm text-gray-600">by {review.userName || "Anonymous"}</p>
                </div>

                {canDelete && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 p-1"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z" clipRule="evenodd" />
                        </svg>
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

// Review Summary Component
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

// Reviews List Component
export const ReviewsList = ({ make, model, title = "Reviews" }) => {
    const { makeModelReviews, getReviewsByMakeAndModel, deleteReview, loading } = useReviewStore();
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
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
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
                    {makeModelReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
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