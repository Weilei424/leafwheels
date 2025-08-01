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
                    <img
                        className="w-20 h-20 rounded-lg object-cover"
                        // src={item.imageUrl || '/images/placeholder.jpg'}
                        alt={item.name}
                        onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                        }}
                    />
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
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onUpdateQuantity?.(item.productId, -1)}
                                            disabled={item.quantity <= 1}
                                            className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            −
                                        </motion.button>
                                        <motion.span
                                            key={item.quantity} // Key on quantity for smooth updates
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.1 }}
                                            className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center"
                                        >
                                            {item.quantity}
                                        </motion.span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onUpdateQuantity?.(item.productId, +1)}
                                            className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            +
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
                            className="text-sm text-red-600 hover:text-red-700 mt-3 transition-colors"
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
                                key={totalPrice} // Animate price changes
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
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
                            key={totalPrice} // Animate price changes
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
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