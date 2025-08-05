import React from 'react';
import { motion } from "framer-motion";

const CartItem = ({ item = {}, onRemove, onUpdateQuantity, isCheckout = false }) => {
    const isDiscounted = item.onDeal && item.discountPercentage > 0 && item.discountPrice < item.price;
    const isAccessory = item.type === "ACCESSORY";
    const unitPrice = item.discountPrice;
    const totalPrice = unitPrice * item.quantity;

    return (
        <motion.div
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
            <div className="flex items-center gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                            src={item.imageUrls?.[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>

                    {/* Quantity Section */}
                    <div className="mt-2 flex items-center gap-4">
                        {isAccessory ? (
                            isCheckout ? (
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Qty:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onUpdateQuantity?.(item.productId, -1)}
                                            disabled={item.quantity <= 1}
                                            className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center"
                                        >
                                            <span className="text-lg leading-none">−</span>
                                        </motion.button>

                                        <div className="px-3 py-1 text-center bg-gray-50 border-x border-gray-300">
                                            <motion.span
                                                key={item.quantity}
                                                initial={{ scale: 1.2, color: "#059669" }}
                                                animate={{ scale: 1, color: "#374151" }}
                                                transition={{ duration: 0.2 }}
                                                className="text-sm font-medium"
                                            >
                                                {item.quantity}
                                            </motion.span>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onUpdateQuantity?.(item.productId, +1)}
                                            className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                                        >
                                            <span className="text-lg leading-none">+</span>
                                        </motion.button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        )}

                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isAccessory
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {isAccessory ? 'Accessory' : 'Vehicle'}
                        </span>
                    </div>

                    {/* Remove Button */}
                    {!isCheckout && onRemove && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onRemove?.(item._id)}
                            className="text-sm text-red-600 hover:text-red-700 mt-3 transition-colors duration-200"
                        >
                            Remove
                        </motion.button>
                    )}
                </div>

                {/* Price */}
                <div className="text-right">
                    {/* Unit Price */}
                    <div className="text-sm text-gray-500 mb-1">
                        {item.quantity > 1 && (
                            <span>${unitPrice?.toLocaleString()} each</span>
                        )}
                    </div>

                    {/* Total Price */}
                    {isDiscounted ? (
                        <div>
                            <motion.p
                                key={totalPrice}
                                initial={{ scale: 1.1, color: "#059669" }}
                                animate={{ scale: 1, color: "#111827" }}
                                transition={{ duration: 0.3 }}
                                className="text-lg font-semibold text-gray-900"
                            >
                                ${totalPrice?.toLocaleString()}
                            </motion.p>
                            {item.quantity === 1 && (
                                <p className="text-sm text-gray-400 line-through">
                                    ${item.price?.toLocaleString()}
                                </p>
                            )}
                            <p className="text-xs text-red-600 font-medium">
                                {Math.round(item.discountPercentage * 100)}% OFF
                            </p>
                        </div>
                    ) : (
                        <motion.p
                            key={totalPrice}
                            initial={{ scale: 1.1, color: "#059669" }}
                            animate={{ scale: 1, color: "#111827" }}
                            transition={{ duration: 0.3 }}
                            className="text-lg font-semibold text-gray-900"
                        >
                            ${totalPrice?.toLocaleString()}
                        </motion.p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(CartItem);