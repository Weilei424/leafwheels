import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AccessoryCard = ({ accessory, onAddToCart }) => {
    if (!accessory) return null;

    // Use backend calculated values directly
    const originalPrice = Number(accessory.price || 0);
    const discountPercent = Number(accessory.discountPercentage || 0);

    const isOnDeal = accessory.onDeal && discountPercent > 0;
    const finalPrice = isOnDeal
        ? originalPrice * (1 - discountPercent)
        : originalPrice;

    // Check stock availability
    const canAddToCart = accessory.quantity > 0;

    // Stock status display
    const getStockStatus = () => {
        if (accessory.quantity === 0) return { label: "Out of Stock", color: "text-red-500" };
        if (accessory.quantity <= 5) return { label: `${accessory.quantity} left`, color: "text-amber-600" };
        return { label: "In Stock", color: "text-green-600" };
    };

    const stockStatus = getStockStatus();


    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
        >
            {/* Discount Badge */}
            {isOnDeal  && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                    {Math.round(discountPercent * 100)}% OFF
                </div>
            )}

            <Link to={`/accessory/${accessory.id}`} className="block">
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                    <img
                        // src={accessory.imageUrls?.[0] || "/placeholder-accessory.jpg"}
                        alt={accessory.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                            e.target.src = "/placeholder-accessory.jpg";
                        }}
                    />
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                    <h3 className="font-medium text-gray-900">
                        {accessory.name}
                    </h3>

                    <span className={`text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
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

            {/* Button */}
            <div className="p-4 pt-0">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (canAddToCart) onAddToCart(accessory);
                    }}
                    disabled={!canAddToCart}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all
                        ${canAddToCart
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {canAddToCart ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </motion.div>
    );
};

export default AccessoryCard;