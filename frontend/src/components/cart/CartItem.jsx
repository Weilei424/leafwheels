import React from 'react';
import { motion } from "framer-motion";

const CartItem = ({ item = {}, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
            <div className="flex items-center gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                    <img
                        className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onRemove?.(item._id)}
                        className="text-sm text-red-600 hover:text-red-700 mt-2 transition-colors"
                    >
                        Remove
                    </motion.button>
                </div>

                {/* Price */}
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                        ${item.price ? item.price.toLocaleString() : '0'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;