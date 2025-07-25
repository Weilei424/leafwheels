import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore.js";
import {motion} from "framer-motion";

const OrderSummary = () => {
    const navigate = useNavigate();
    const { cart, subtotal, tax, shipping, savings, total } = useCartStore();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate('/checkout');
    };

    // Calculate original subtotal (before discounts) for display
    const originalSubtotal = cart.reduce((sum, item) => {
        const quantity = item.quantity || 1;
        const unitPrice = item.unitPrice || 0;
        return sum + (unitPrice * quantity);
    }, 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4"
        >
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({cart.length})</span>
                    <span className="text-gray-900">${originalSubtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Savings</span>
                        <span className="text-green-600 font-medium">-${savings.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">
                        {"Free"}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (13%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                    <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    Proceed to Checkout
                </motion.button>

                <div className="text-center text-sm text-gray-500">
                    or{' '}
                    <Link to="/store" className="text-green-600 hover:text-green-700 font-medium">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;