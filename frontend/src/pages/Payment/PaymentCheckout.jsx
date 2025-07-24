import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import ReviewStep from "../../components/payment/ReviewStep";
import PaymentStep from "../../components/payment/PaymentStep";
import ProcessingStep from "../../components/payment/ProcessingStep";
import ResultStep from "../../components/payment/ResultStep";


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
      className="min-h-screen  py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
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

export default CheckoutPage;
