import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AccessoryCard = ({ accessory, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!accessory) return null;

    // Use backend calculated values directly
    const originalPrice = Number(accessory.price || 0);
    const discountPercent = Number(accessory.discountPercentage || 0);

    const isOnDeal = accessory.onDeal && discountPercent > 0;
    const finalPrice = isOnDeal
        ? originalPrice * (1 - discountPercent)
        : originalPrice;

    // Check stock availability
    const canAddToCart = accessory.quantity > 0 && quantity <= accessory.quantity;

    // Stock status display
    const getStockStatus = () => {
        if (accessory.quantity === 0) return { label: "Out of Stock", color: "text-red-500" };
        if (accessory.quantity <= 5) return { label: `${accessory.quantity} left`, color: "text-amber-600" };
        return { label: "In Stock", color: "text-green-600" };
    };

    const stockStatus = getStockStatus();

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Math.min(Number(e.target.value), accessory.quantity));
        setQuantity(value);
    };

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        onAddToCart(accessory, quantity);
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

            <Link to={`/accessory/${accessory.id}`} className="block">
                {/* Single Image Display */}
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                    <img
                        src={accessory.imageUrls?.[0]}
                        alt={accessory.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Accessory Info */}
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

            {/* Quantity and Add to Cart */}
            <div className="p-4 pt-0 space-y-3">
                {/* Quantity Selector */}
                {accessory.quantity > 0 && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(Math.max(1, quantity - 1));
                                }}
                                disabled={quantity <= 1}
                                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={accessory.quantity}
                                value={quantity}
                                onChange={handleQuantityChange}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-16 px-2 py-1 text-center border-0 focus:outline-none text-sm"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(Math.min(accessory.quantity, quantity + 1));
                                }}
                                disabled={quantity >= accessory.quantity}
                                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                        canAddToCart
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
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