import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useReviewStore} from "../../stores/useReviewsStore.js";
import {useUserStore} from "../../stores/useUserStore.js";
import {ReviewForm, ReviewsList, ReviewSummary, StarRating} from "../../components/reviews/ReviewComponents.jsx";


export const VehicleReviewsPage = () => {
    const { make, model } = useParams();
    const { hasUserReviewedVehicle } = useReviewStore();
    const { user } = useUserStore();

    const [showForm, setShowForm] = useState(false);
    const hasReviewed = user ? hasUserReviewedVehicle(user.id, make, model) : false;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 p-15 max-w-4xl mx-auto"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-light text-gray-900 mb-2"
            >
                {make} {model} Reviews
            </motion.h1>

            <div className="grid lg:grid-cols-3 gap-8 py-2">
                <div className="lg:col-span-2 space-y-8">
                    {/* Review Form */}
                    {user && !hasReviewed && (
                        <div>
                            {!showForm ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowForm(true)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                >
                                    Write a Review
                                </motion.button>
                            ) : (
                                <ReviewForm
                                    make={make}
                                    model={model}
                                    onSuccess={() => {
                                        setShowForm(false);
                                        // Refresh reviews
                                        window.location.reload();
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {hasReviewed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 text-sm">
                                ✓ You have already reviewed this vehicle
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <ReviewsList make={make} model={model} />
                </div>

                {/* Sidebar */}
                <div>
                    <ReviewSummary make={make} model={model} />
                </div>
            </div>
        </motion.div>
    );
};


export const UserReviewsPage = () => {
    const { user } = useUserStore();
    const { userReviews, getReviewsByUser, deleteReview, loading } = useReviewStore();

    useEffect(() => {
        if (user) {
            getReviewsByUser(user.id);
        }
    }, [user, getReviewsByUser]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please sign in to view your reviews.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-4xl mx-auto pt-20"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900 mb-10"
            >
                My Reviews
            </motion.h1>

            {loading ? (
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
            ) : userReviews.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = "/store"}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
                    >
                        Browse Vehicles
                    </motion.button>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {userReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {review.make} {review.model}
                                        </h3>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StarRating rating={review.rating} readonly size="sm" />
                                            <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => deleteReview(review.id)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>
                                </div>

                                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                                <p className="text-gray-700 mb-4">{review.comment}</p>

                                {review.recommend && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Recommended this vehicle
                                    </div>
                                )}
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};


export const AllReviewsPage = () => {
    const { reviews, getAllReviews, loading } = useReviewStore();


    useEffect(() => {
        getAllReviews();
    }, [getAllReviews]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-6xl mx-auto"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-light text-gray-900 mb-8"
            >
                All Reviews
            </motion.h1>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...new Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        {review.make} {review.model}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-2">
                                        <StarRating rating={review.rating} readonly size="sm" />
                                        <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    <h4 className="font-medium text-gray-900">{review.title}</h4>
                                    <p className="text-sm text-gray-600">by {user.firstName || "Anonymous"}</p>
                                </div>

                                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{review.comment}</p>

                                {review.recommend && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Recommends
                                    </div>
                                )}

                                <Link
                                    to={`/vehicle/${review.make}/${review.model}/reviews`}
                                    className="inline-block mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                    View All Reviews →
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};
