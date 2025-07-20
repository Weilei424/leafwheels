import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { useUserStore } from "../../stores/useUserStore.js";

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
        error
    } = usePaymentStore();

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
        billingAddress: "",
        city: "",
        postalCode: "",
        country: "Canada"
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
        setPaymentData(prev => ({ ...prev, [field]: value }));
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
                ...paymentData
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
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
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
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${item.unitPrice.toLocaleString()}</p>
                                </motion.div>
                            ))}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-green-600">${total.toLocaleString()}</span>
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
                            {step === "processing" && (
                                <ProcessingStep />
                            )}
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

// Review Step Component
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
                <p className="text-sm text-green-700">
                    ✓ Free shipping on all orders
                </p>
                <p className="text-sm text-green-700">
                    ✓ 30-day return policy
                </p>
                <p className="text-sm text-green-700">
                    ✓ 2-year warranty included
                </p>
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

// Payment Step Component
const PaymentStep = ({ paymentData, onInputChange, onSubmit, error }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
    >
        <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>

        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Card Number"
                    value={paymentData.cardNumber}
                    onChange={(e) => onInputChange("cardNumber", e.target.value)}
                    className="col-span-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
                <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => onInputChange("expiryDate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
                <input
                    type="text"
                    placeholder="CVV"
                    value={paymentData.cvv}
                    onChange={(e) => onInputChange("cvv", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
            </div>

            <input
                type="text"
                placeholder="Name on Card"
                value={paymentData.nameOnCard}
                onChange={(e) => onInputChange("nameOnCard", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
            />

            <input
                type="text"
                placeholder="Billing Address"
                value={paymentData.billingAddress}
                onChange={(e) => onInputChange("billingAddress", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="City"
                    value={paymentData.city}
                    onChange={(e) => onInputChange("city", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Postal Code"
                    value={paymentData.postalCode}
                    onChange={(e) => onInputChange("postalCode", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                    <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
                Complete Payment
            </motion.button>
        </form>
    </motion.div>
);

// Processing Step Component
const ProcessingStep = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
    >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we process your payment...</p>
    </motion.div>
);

// Result Step Component
const ResultStep = ({ result, onRetry, onNewOrder }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-center py-8"
    >
        {result?.status === "APPROVED" ? (
            <div className="space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </motion.div>
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600">Your order has been confirmed.</p>
                    {result.orderId && (
                        <p className="text-sm text-gray-500 mt-2">Order ID: {result.orderId}</p>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewOrder}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                    Continue Shopping
                </motion.button>
            </div>
        ) : (
            <div className="space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                >
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.div>
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-600">{result?.failureReason || "Please try again."}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRetry}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                    Try Again
                </motion.button>
            </div>
        )}
    </motion.div>
);

// Payment History Page
const PaymentHistoryPage = () => {
    const { user } = useUserStore();
    const { paymentHistory, loading, getPaymentHistory, cancelPayment } = usePaymentStore();

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
                            onClick={() => window.location.href = "/store"}
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

// Payment Card Component
const PaymentCard = ({ payment, onCancel, index }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED": return "text-green-600 bg-green-50";
            case "DENIED": return "text-red-600 bg-red-50";
            case "PENDING": return "text-yellow-600 bg-yellow-50";
            case "CANCELLED": return "text-gray-600 bg-gray-50";
            default: return "text-gray-600 bg-gray-50";
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
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

export { CheckoutPage, PaymentHistoryPage };