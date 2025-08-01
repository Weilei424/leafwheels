import {useParams} from "react-router-dom";
import {useReviewStore} from "../../stores/useReviewsStore.js";
import {useUserStore} from "../../stores/useUserStore.js";
import {useState} from "react";
import {motion} from "framer-motion";
import {ReviewForm, ReviewsList, ReviewSummary} from "../../components/reviews/ReviewComponents.jsx";

const VehicleReviewsPage = () => {
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

export default VehicleReviewsPage;