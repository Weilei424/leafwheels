import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import ReviewStep from "../../components/payment/ReviewStep";
import PaymentStep from "../../components/payment/PaymentStep";
import ProcessingStep from "../../components/payment/ProcessingStep";
import ResultStep from "../../components/payment/ResultStep";
import PaymentCard from "../../components/payment/PaymentCard";

// Clean Checkout Page
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { cart, total, clearCart } = useCartStore();
  const {
    createPaymentSession,
    processPayment,
    loading,
    processingPayment,
    paymentResult,
    clearPaymentResult,
    error,
  } = usePaymentStore();

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: "Canada",
  });

  const [step, setStep] = useState("review"); // review, payment, processing, result

  useEffect(() => {
    if (!user || cart.length === 0) {
      navigate("/cart");
    }
  }, [user, cart, navigate]);

  useEffect(() => {
    if (paymentResult) {
      setStep("result");
      if (paymentResult.status === "APPROVED") {
        clearCart();
      }
    }
  }, [paymentResult, clearCart]);

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartPayment = async () => {
    try {
      setStep("payment");
      await createPaymentSession(user.id);
    } catch (error) {
      console.error("Failed to create payment session:", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setStep("processing");

    try {
      await processPayment({
        userId: user.id,
        cartTotal: total,
        paymentMethod: "CARD",
        ...paymentData,
      });
    } catch (error) {
      setStep("payment");
      console.error("Payment failed:", error);
    }
  };

  const handleRetry = () => {
    clearPaymentResult();
    setStep("payment");
  };

  if (!user || cart.length === 0) return null;

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
          className="text-3xl font-light text-gray-900 mb-8 text-center"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${item.unitPrice.toLocaleString()}
                  </p>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <AnimatePresence mode="wait">
              {step === "review" && (
                <ReviewStep onContinue={handleStartPayment} loading={loading} />
              )}
              {step === "payment" && (
                <PaymentStep
                  paymentData={paymentData}
                  onInputChange={handleInputChange}
                  onSubmit={handlePayment}
                  error={error}
                />
              )}
              {step === "processing" && <ProcessingStep />}
              {step === "result" && (
                <ResultStep
                  result={paymentResult}
                  onRetry={handleRetry}
                  onNewOrder={() => navigate("/store")}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Payment History Page
const PaymentHistoryPage = () => {
  const { user } = useUserStore();
  const { paymentHistory, loading, getPaymentHistory, cancelPayment } =
    usePaymentStore();

  useEffect(() => {
    if (user) {
      getPaymentHistory(user.id);
    }
  }, [user, getPaymentHistory]);

  const handleCancel = async (orderId) => {
    try {
      await cancelPayment(orderId);
    } catch (error) {
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
              onClick={() => (window.location.href = "/store")}
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

export { CheckoutPage, PaymentHistoryPage };
