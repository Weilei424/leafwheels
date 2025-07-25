import {useState, useEffect, useMemo} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import { useOrderStore } from "../../stores/useOrderStore.js"; // ✅ ADD ORDER STORE
import ReviewStep from "../../components/payment/ReviewStep";
import PaymentStep from "../../components/payment/PaymentStep";
import ProcessingStep from "../../components/payment/ProcessingStep";
import ResultStep from "../../components/payment/ResultStep";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { cart, total, clearCart } = useCartStore();
  const {
    paymentSession,
    paymentResult,
    creatingSession,
    processingPayment,
    error,
    createPaymentSession,
    processPayment,
    clearPaymentResult,
    resetPaymentFlow,
  } = usePaymentStore();

  // ✅ ADD ORDER STORE
  const { createOrderFromCart } = useOrderStore();

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

  // Derive current step from store state
  const getCurrentStep = () => {
    if (paymentResult) return "result";
    if (processingPayment) return "processing";
    if (paymentSession) return "payment";
    return "review";
  };

  const currentStep = getCurrentStep();

  // ✅ UPDATED: Handle successful payment AND create order
  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      if (paymentResult?.status === "APPROVED") {
        try {
          // Create order from cart after successful payment
          await createOrderFromCart(user.id);
          // Clear cart only after successful order creation
          await clearCart(user.id);
        } catch (orderError) {
          console.error("Failed to create order after payment:", orderError);
          // Payment succeeded but order creation failed - log for manual handling
        }
      }
    };

    handleSuccessfulPayment();
  }, [paymentResult, user.id, createOrderFromCart, clearCart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetPaymentFlow();
    };
  }, [resetPaymentFlow]);

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartPayment = async () => {
    try {
      await createPaymentSession(user.id);
    } catch (error) {
      console.error("Failed to create payment session:", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      await processPayment({
        userId: user.id,
        cartTotal: total,
        paymentMethod: "CARD",
        ...paymentData,
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleRetry = () => {
    clearPaymentResult();
  };

  const handleNewOrder = () => {
    resetPaymentFlow();
    navigate("/store");
  };

  // ✅ IMPROVED: Better cart transformation with discount handling
  const transformedCart = useMemo(
      () =>
          cart.map((item) => {
            const isVehicle = item.type === "VEHICLE";
            const product = isVehicle ? item.vehicle : item.accessory;

            // Handle discounted pricing
            const isDiscounted = product?.onDeal &&
                product?.discountPercentage > 0 &&
                product?.discountPrice < item.unitPrice;

            const displayPrice = isDiscounted ? product.discountPrice : item.unitPrice;

            return {
              id: item.id,
              name: isVehicle
                  ? `${product.year} ${product.make} ${product.model}`
                  : product.name,
              price: displayPrice,
              originalPrice: item.unitPrice,
              quantity: item.quantity,
              type: item.type,
              isDiscounted,
              discountPercentage: product?.discountPercentage || 0
            };
          }),
      [cart]
  );

  // Guard clause
  if (!user || cart.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {!user ? "Please log in to continue" : "Your cart is empty"}
            </h2>
            <button
                onClick={() => navigate(!user ? "/login" : "/store")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {!user ? "Go to Login" : "Continue Shopping"}
            </button>
          </div>
        </div>
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen py-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Checkout
          </motion.h1>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {["review", "payment", "processing", "result"].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            getCurrentStepIndex(currentStep) >= index
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {index + 1}
                    </div>
                    {index < 3 && (
                        <div
                            className={`w-16 h-1 ${
                                getCurrentStepIndex(currentStep) > index
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                            }`}
                        />
                    )}
                  </div>
              ))}
            </div>
          </div>

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
                {transformedCart.map((item, index) => (
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
                        {/* ✅ SHOW DISCOUNT INFO */}
                        {item.isDiscounted && (
                            <p className="text-xs text-green-600 font-medium">
                              {item.discountPercentage}% OFF
                            </p>
                        )}
                      </div>
                      <div className="text-right">
                        {/* ✅ SHOW DISCOUNTED PRICE */}
                        {item.isDiscounted ? (
                            <>
                              <p className="font-semibold text-green-600">
                                ${item.price.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                ${item.originalPrice.toLocaleString()}
                              </p>
                            </>
                        ) : (
                            <p className="font-semibold">
                              ${item.price.toLocaleString()}
                            </p>
                        )}
                      </div>
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
                {currentStep === "review" && (
                    <ReviewStep
                        onContinue={handleStartPayment}
                        loading={creatingSession}
                    />
                )}
                {currentStep === "payment" && (
                    <PaymentStep
                        paymentData={paymentData}
                        onInputChange={handleInputChange}
                        onSubmit={handlePayment}
                        error={error}
                        loading={processingPayment}
                    />
                )}
                {currentStep === "processing" && <ProcessingStep />}
                {currentStep === "result" && (
                    <ResultStep
                        result={paymentResult}
                        onRetry={handleRetry}
                        onNewOrder={handleNewOrder}
                    />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
  );
};

// Helper function to get step index for progress indicator
const getCurrentStepIndex = (step) => {
  const steps = ["review", "payment", "processing", "result"];
  return steps.indexOf(step);
};

export default CheckoutPage;