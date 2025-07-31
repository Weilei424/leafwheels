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
      case "REFUNDED":
        return "text-blue-600 bg-blue-50";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              Transaction ID: {payment.transactionId || `PAY-${payment.id}`}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Order ID: {payment.orderId}</span>
                <span>• {formatDate(payment.createdAt)}</span>
              </div>
              {payment.paymentMethod && (
                  <p className="text-xs text-gray-600">
                    Payment Method: {payment.paymentMethod}
                  </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
          <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  payment.status
              )}`}
          >
            {payment.status}
          </span>
            <span className="font-semibold text-gray-900">
            ${(payment.amount)}
          </span>
          </div>
        </div>

        {/* Display message */}
        {payment.message && (
            <div className="mb-3">
              <p className={`text-xs px-3 py-2 rounded ${
                  payment.status === "DENIED"
                      ? "text-red-700 bg-red-50 border-l-2 border-red-200"
                      : payment.status === "APPROVED"
                          ? "text-green-700 bg-green-50"
                          : payment.status === "REFUNDED"
                              ? "text-blue-700 bg-blue-50"
                              : "text-gray-700 bg-gray-50"
              }`}>
                {payment.message}
              </p>
            </div>
        )}



        {/* Action buttons */}
        {(payment.status === "APPROVED" || payment.status === "PENDING") && (
            <div className="flex justify-end">
              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCancel(payment.orderId)}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors font-medium ${
                      payment.status === "APPROVED"
                          ? "text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          : "text-gray-600 hover:text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {payment.status === "APPROVED" ? "Cancel & Refund" : "Cancel Payment"}
              </motion.button>
            </div>
        )}
      </motion.div>
  );
};

export default PaymentCard;