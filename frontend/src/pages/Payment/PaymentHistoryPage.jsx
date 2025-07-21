import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import PaymentCard from "../../components/payment/PaymentCard";

const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { paymentHistory, loading, getPaymentHistory, cancelPayment } =
    usePaymentStore();
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (user) {
      getPaymentHistory(user.id);
    }
  }, [user, getPaymentHistory]);

  const handleCancel = async (orderId) => {
    setCancelError("");
    try {
      await cancelPayment(orderId);
    } catch (error) {
      setCancelError("Failed to cancel payment. Please try again.");
      console.error("Failed to cancel payment:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view payment history.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-light text-gray-900 mb-8"
        >
          Payment History
        </motion.h1>

        {cancelError && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {cancelError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"
            />
          </div>
        ) : paymentHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">No payment history found.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/store")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment, index) => (
              <PaymentCard
                key={payment.id || index}
                payment={payment}
                onCancel={handleCancel}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentHistoryPage;
