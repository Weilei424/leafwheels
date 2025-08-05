import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const VehicleCard = ({ vehicle, onAddToCart, onAddToComparison, isInComparison, isComparisonFull }) => {
    if (!vehicle) return null;

    const originalPrice = Number(vehicle.price || 0);
    const discountPercent = Number(vehicle.discountPercentage || 0);
    const isOnDeal = vehicle.onDeal && discountPercent > 0;
    const finalPrice = isOnDeal
        ? originalPrice * (1 - discountPercent)
        : originalPrice;

    const statusColors = {
        AVAILABLE: "text-green-600",
        SOLD: "text-red-500",
        DEMO: "text-blue-600",
        PENDING: "text-amber-600",
        INCOMING: "text-purple-600",
    };

    const statusInfo = {
        color: statusColors[vehicle.status] || "text-gray-600",
        label: vehicle.status || "Unknown",
    };

    const canAddToCart = vehicle.status === "AVAILABLE" || vehicle.status === "DEMO";

    const handleComparisonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToComparison(vehicle);
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
        >
            {/* Discount Badge */}
            {isOnDeal && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                    {Math.round(discountPercent * 100)}% OFF
                </div>
            )}

            {/* Comparison Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleComparisonClick}
                disabled={!isInComparison && isComparisonFull}
                className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                    isInComparison
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                        : isComparisonFull
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-600 hover:bg-gray-100 shadow-md border border-gray-200 hover:border-gray-300"
                }`}
                title={
                    isInComparison
                        ? "Remove from comparison"
                        : isComparisonFull
                            ? "Comparison full (max 4)"
                            : "Add to comparison"
                }
            >
                {isInComparison ? "✓" : "⚖️"}
            </motion.button>

            <Link to={`/vehicle/${vehicle.id}`} className="block">
                {/* Single Image Display */}
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                    <img
                        src={vehicle.imageUrls?.[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Vehicle Info */}
                <div className="p-4 space-y-2">
                    <h3 className="font-medium text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>

                    <span className={`text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>

                    <div className="text-lg font-semibold text-gray-900">
                        ${finalPrice.toLocaleString()}
                        {isOnDeal && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                                ${originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="p-4 pt-0">
                <button
                    onClick={() => {
                        if (canAddToCart) onAddToCart();
                    }}
                    disabled={!canAddToCart}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                        canAddToCart
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {canAddToCart ? "Add to Cart" : "Unavailable"}
                </button>
            </div>
        </motion.div>
    );
};

export default VehicleCard;