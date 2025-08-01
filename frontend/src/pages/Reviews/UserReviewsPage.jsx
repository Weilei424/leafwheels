import {useUserStore} from "../../stores/useUserStore.js";
import {useReviewStore} from "../../stores/useReviewsStore.js";
import {useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import ReviewCard from "../../components/reviews/ReviewCard.jsx";

const UserReviewsPage = () => {
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
                        <div key={`loading-user-review-${i}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
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
                        {userReviews.map((review, index) => (
                            <ReviewCard
                                key={review.id || review.reviewId || `user-review-${index}`}
                                review={review}
                                canDelete={true}
                                onDelete={deleteReview}
                                showVehicleInfo={true}
                                showUserInfo={false}
                                className="mb-4"
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default UserReviewsPage;