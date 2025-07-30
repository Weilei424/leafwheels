import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {usePaymentStore} from "../stores/usePaymentStore.js";
import {useUserStore} from "../stores/useUserStore.js";

export const useCheckoutFlow = () => {
    const navigate = useNavigate();
    const {user} = useUserStore();
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

    // Determine current step based on payment state
    const getCurrentStep = () => {
        if (paymentResult) return "result";
        if (processingPayment) return "processing";
        if (paymentSession) return "payment";
        return "review";
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => resetPaymentFlow();
    }, [resetPaymentFlow]);

    const updatePaymentData = (field, value) => {
        setPaymentData(prev => ({...prev, [field]: value}));
    };

    const startPaymentSession = async () => {
        try {
            await createPaymentSession(user.id);
        } catch (error) {
            console.error("Failed to create payment session:", error);
        }
    };

    const submitPayment = async (cartTotal) => {
        try {
            await processPayment({
                userId: user.id,
                cartTotal,
                paymentMethod: "CARD",
                ...paymentData,
            });
        } catch (error) {
            console.error("Payment failed:", error);
        }
    };

    const retryPayment = () => {
        clearPaymentResult();
    };

    const startNewOrder = () => {
        resetPaymentFlow();
        navigate("/store");
    };

    return {
        // State
        currentStep: getCurrentStep(),
        paymentData,
        user,
        // Loading states
        creatingSession,
        processingPayment,
        error,
        paymentResult,
        // Actions
        updatePaymentData,
        startPaymentSession,
        submitPayment,
        retryPayment,
        startNewOrder,
    };
};
