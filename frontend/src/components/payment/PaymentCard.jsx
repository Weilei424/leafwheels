import React from "react";
import { motion } from "framer-motion";

const PaymentCard = ({ payment, onCancel, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "DENIED":
        return "text-red-600 bg-red-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-gray-900">
            Order #{payment.orderId || `PAY-${payment.id}`}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(payment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              payment.status
            )}`}
          >
            {payment.status}
          </span>
          <span className="font-semibold text-gray-900">
            ${payment.amount?.toLocaleString() || "0.00"}
          </span>
        </div>
      </div>

      {payment.status === "APPROVED" && (
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCancel(payment.orderId)}
            className="text-sm text-red-600 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel & Refund
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentCard;
