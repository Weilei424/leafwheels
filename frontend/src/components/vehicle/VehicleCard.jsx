import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReviewStore } from "../../stores/useReviewsStore.js"; // Fixed import
import { StarRating } from "../reviews/ReviewComponents.jsx";

const VehicleCard = ({ vehicle, onAddToCart }) => {
    const { getAverageRating, getReviewCount } = useReviewStore();
    const averageRating = getAverageRating(vehicle.make, vehicle.model);
    const reviewCount = getReviewCount(vehicle.make, vehicle.model);

    if (!vehicle) return null;

    const toNumber = (value) => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(num) ? 0 : num;
    };

    const discountPrice = toNumber(vehicle.discountPrice);
    const regularPrice = toNumber(vehicle.price);
    const hasDiscount = vehicle.onDeal && discountPrice > 0 && regularPrice > 0 && discountPrice < regularPrice;
    const displayPrice = hasDiscount ? discountPrice : regularPrice;

    const getDiscountPercentage = () => {
        if (!hasDiscount) return 0;
        if (vehicle.discountPercentage && vehicle.discountPercentage > 0) {
            return Math.round(toNumber(vehicle.discountPercentage) * 100);
        }
        return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "AVAILABLE": return { color: "text-green-600", label: "Available" };
            case "SOLD": return { color: "text-red-500", label: "Sold" };
            case "DEMO": return { color: "text-blue-600", label: "Demo" };
            case "PENDING": return { color: "text-amber-600", label: "Pending" };
            case "INCOMING": return { color: "text-purple-600", label: "Incoming" };
            default: return { color: "text-gray-600", label: status || "Unknown" };
        }
    };

    const statusInfo = getStatusInfo(vehicle.status);
    const canAddToCart = vehicle.status === "AVAILABLE" || vehicle.status === "DEMO";

    const getButtonText = () => {
        switch (vehicle.status) {
            case "SOLD": return "Sold Out";
            case "PENDING": return "Pending";
            case "INCOMING": return "Coming Soon";
            default: return "Add to Cart";
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative"
        >
            {/* Discount Badge */}
            {hasDiscount && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10"
                >
                    {getDiscountPercentage()}% OFF
                </motion.div>
            )}

            <Link to={`/vehicle/${vehicle.id}`} className="block">
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                    <img
                        // src={vehicle.imageUrl || "/placeholder-vehicle.jpg"}
                        alt={`${vehicle.make || 'Unknown'} ${vehicle.model || 'Vehicle'}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                            e.target.src = "/placeholder-vehicle.jpg";
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                        {vehicle.hasAccidentHistory && (
                            <span className="text-xs text-amber-600">⚠️</span>
                        )}
                    </div>

                    {/* Reviews - Show BEFORE price for better visibility */}
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-2">
                            <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                            <span className="text-sm text-gray-600">
                                {averageRating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="space-y-1">
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">
                                    ${displayPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    ${regularPrice.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-semibold text-gray-900">
                                ${displayPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="p-4 pt-0">
                <motion.button
                    whileHover={canAddToCart ? { scale: 1.02 } : {}}
                    whileTap={canAddToCart ? { scale: 0.98 } : {}}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (canAddToCart) {
                            onAddToCart(vehicle);
                        }
                    }}
                    disabled={!canAddToCart}
                    className={`
                        w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200
                        ${canAddToCart
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                    `}
                    aria-label={`Add ${vehicle.make || 'vehicle'} ${vehicle.model || ''} to cart`}
                >
                    {getButtonText()}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default VehicleCard;