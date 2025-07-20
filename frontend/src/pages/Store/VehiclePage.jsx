import React, { useEffect, useState, useMemo } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";
import { ReviewSummary, ReviewsList } from "../../components/reviews/ReviewComponents.jsx";



const toNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
};

const useVehicleLogic = (id) => {
    const {
        currentVehicle,
        loading,
        error,
        getVehicleById,
        clearCurrentVehicle,
        clearError
    } = useVehicleStore();
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        clearCurrentVehicle();
        clearError();
        if (id) {
            getVehicleById(id);
        }
        return () => clearCurrentVehicle();
    }, [id, getVehicleById, clearCurrentVehicle, clearError]);

    const displayPrices = useMemo(() => {
        if (!currentVehicle) {
            return {
                displayPrice: 0,
                originalPrice: 0,
                hasDiscount: false,
                discountPercentage: 0,
            };
        }

        const discountPrice = toNumber(currentVehicle.discountPrice);
        const originalPrice = toNumber(currentVehicle.price);
        const hasDiscount = currentVehicle.onDeal && discountPrice > 0 && originalPrice > 0 && discountPrice < originalPrice;

        let discountPercentage = 0;
        if (hasDiscount) {
            if (currentVehicle.discountPercentage) {
                discountPercentage = Math.round(toNumber(currentVehicle.discountPercentage) * 100);
            } else {
                discountPercentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
            }
        }

        return {
            displayPrice: hasDiscount ? discountPrice : originalPrice,
            originalPrice,
            hasDiscount,
            discountPercentage,
        };
    }, [currentVehicle]);

    return {
        vehicle: currentVehicle,
        loading,
        error,
        addingToCart,
        setAddingToCart,
        ...displayPrices
    };
};

const getStatusInfo = (status) => {
    switch (status) {
        case "AVAILABLE": return { color: "text-green-600", label: "Available" };
        case "SOLD": return { color: "text-red-500", label: "Sold" };
        case "DEMO": return { color: "text-blue-600", label: "Demo" };
        case "INCOMING": return { color: "text-amber-600", label: "Incoming" };
        default: return { color: "text-gray-600", label: status || "Unknown" };
    }
};

const VehiclePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        vehicle,
        loading,
        error,
        addingToCart,
        setAddingToCart,
        displayPrice,
        originalPrice,
        hasDiscount,
        discountPercentage
    } = useVehicleLogic(id);

    const handleBackToStore = () => navigate("/store");

    const onAddToCartClick = async () => {
        setAddingToCart(true);
        await handleAddToCart({ product: vehicle, type: "VEHICLE" });
        setAddingToCart(false);
    };

    const statusInfo = getStatusInfo(vehicle?.status);
    const canAddToCart = vehicle?.status === "AVAILABLE" || vehicle?.status === "DEMO";

    // Loading State
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto"
                    />
                    <p className="text-gray-600">Loading vehicle...</p>
                </div>
            </motion.div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center space-y-6">
                    <p className="text-red-600 text-lg">Error: {error}</p>
                    <div className="flex gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Try Again
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBackToStore}
                            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Back to Store
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Not Found State
    if (!vehicle) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center space-y-6">
                    <p className="text-gray-600 text-lg">Vehicle not found</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBackToStore}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Back to Store
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen mt-8 py-8 px-4 max-w-7xl mx-auto"
        >
            {/* Clean Breadcrumb */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={handleBackToStore}
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                    ← Back to Store
                </motion.button>
            </motion.nav>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                >
                    <img
                        // src={vehicle.imageUrl || "/placeholder-vehicle.jpg"}
                        alt={`${vehicle.make || ''} ${vehicle.model || ''}`}
                        className="w-full h-auto rounded-xl object-cover max-h-[500px]"
                        onError={(e) => { e.target.src = "/placeholder-vehicle.jpg"; }}
                    />
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Title */}
                    <div>
                        <h1 className="text-4xl font-light text-gray-900 mb-2">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        {vehicle.trim && (
                            <p className="text-lg text-gray-500">{vehicle.trim}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
                        {vehicle.hasAccidentHistory && (
                            <span className="text-amber-600 text-sm">⚠️ Accident History</span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        {hasDiscount ? (
                            <>
                                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-light text-gray-900">
                    ${displayPrice.toLocaleString()}
                  </span>
                                    <span className="text-lg text-gray-400 line-through">
                    ${originalPrice.toLocaleString()}
                  </span>
                                </div>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {discountPercentage}% OFF
                                </motion.span>
                            </>
                        ) : (
                            <span className="text-3xl font-light text-gray-900">
                ${displayPrice.toLocaleString()}
              </span>
                        )}
                    </div>

                    {/* Description */}
                    {vehicle.description && (
                        <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                    )}

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={canAddToCart && !addingToCart ? { scale: 1.02 } : {}}
                        whileTap={canAddToCart && !addingToCart ? { scale: 0.98 } : {}}
                        onClick={onAddToCartClick}
                        disabled={!canAddToCart || addingToCart}
                        className={`
              w-full py-4 px-8 rounded-lg font-medium text-lg transition-all duration-200
              ${canAddToCart && !addingToCart
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
            `}
                    >
                        <AnimatePresence mode="wait">
                            {addingToCart ? (
                                <motion.span
                                    key="adding"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Adding...
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {vehicle.status === "SOLD" ? "Sold Out" :
                                        vehicle.status === "INCOMING" ? "Coming Soon" :
                                            "Add to Cart"}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            </div>

            {/* Vehicle Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 grid md:grid-cols-3 gap-8"
            >
                <DetailsSection title="Specifications">
                    <DetailItem label="Body Type" value={vehicle.bodyType} />
                    <DetailItem label="Exterior Color" value={vehicle.exteriorColor} />
                    <DetailItem label="Doors" value={vehicle.doors} />
                    <DetailItem label="Seats" value={vehicle.seats} />
                    <DetailItem label="Mileage" value={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null} />
                    <DetailItem label="Condition" value={vehicle.condition} />
                    <DetailItem label="Battery Range" value={vehicle.batteryRange ? `${vehicle.batteryRange} km` : null} />
                </DetailsSection>

                <DetailsSection title="Vehicle Info">
                    <DetailItem label="VIN" value={vehicle.vin} />
                    <DetailItem label="Listed" value={vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : null} />
                    <DetailItem label="Vehicle ID" value={vehicle.id} />
                </DetailsSection>

                <DetailsSection title="Shipping & Returns">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Free delivery within 2–4 business days across Canada & US.
                        30-day return policy with no restocking fee.
                    </p>
                </DetailsSection>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 space-y-8"
            >
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light text-gray-900">Reviews</h2>
                            <Link
                                to={`/vehicle/${vehicle.make}/${vehicle.model}/reviews`}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                                View All Reviews →
                            </Link>
                        </div>
                        <ReviewsList
                            make={vehicle.make}
                            model={vehicle.model}
                            title=""
                        />
                    </div>
                    <div>
                        <ReviewSummary make={vehicle.make} model={vehicle.model} />
                    </div>
                </div>
            </motion.div>
        </motion.div>


    );
};


const DetailsSection = ({ title, children }) => (
    <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const DetailItem = ({ label, value }) => {
    if (!value) return null;

    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 font-medium">{value}</span>
        </div>
    );
};



export default VehiclePage;