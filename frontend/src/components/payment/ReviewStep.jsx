import React from "react";
import { motion } from "framer-motion";

const ReviewStep = ({ onContinue, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <h2 className="text-lg font-medium text-gray-900">Review Your Order</h2>
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-700">✓ Free shipping on all orders</p>
        <p className="text-sm text-green-700">✓ 30-day return policy</p>
        <p className="text-sm text-green-700">✓ 2-year warranty included</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
      >
        {loading ? "Creating Session..." : "Continue to Payment"}
      </motion.button>
    </div>
  </motion.div>
);

export default ReviewStep;
