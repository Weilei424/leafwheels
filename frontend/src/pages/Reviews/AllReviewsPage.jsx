import {Link} from "react-router-dom";
import {useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useReviewStore} from "../../stores/useReviewsStore.js";

export const AllReviewsPage = () => {
    const { reviews, getAllReviews, loading } = useReviewStore();

    useEffect(() => {
        getAllReviews();
    }, [getAllReviews]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-6xl mx-auto pt-20"
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
                        <div key={`loading-all-review-${i}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
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
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id || `all-review-${index}`}
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
                                    <p className="text-sm text-gray-600">by {review.userFirstName} {review.userLastName}</p>
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

export default AllReviewsPage;