// stores/usePaymentStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useCartStore } from "./useCartStore.js";
import { useUserStore } from "./useUserStore.js";

// =======================
// TYPES & CONSTANTS
// =======================

const PAYMENT_ENDPOINTS = {
    CREATE_SESSION: "/api/v1/payment/session",
    PROCESS_PAYMENT: "/api/v1/payment/process",
    GET_STATUS: (orderId) => `/api/v1/payment/${orderId}/status`,
    GET_HISTORY: (userId) => `/api/v1/payment/user/${userId}`,
    CANCEL_PAYMENT: (orderId) => `/api/v1/payment/${orderId}/cancel`,
};

const PAYMENT_STATUS = {
    PENDING: "PENDING",
    APPROVED: 'APPROVED',
    DENIED: 'DENIED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};

// =======================
// HELPER FUNCTIONS
// =======================

// Helper function to get auth headers for payment operations
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const createErrorMessage = (error, fallback) => {
    return error.response?.data?.message || fallback;
};

const handleApiError = (error, fallback, set, loadingKey) => {
    const errorMessage = createErrorMessage(error, fallback);
    set({ error: errorMessage, [loadingKey]: false });
    toast.error(errorMessage);
    return errorMessage;
};

const handleSuccessfulPayment = async (paymentResult, paymentData) => {
    console.log("Payment result:", paymentResult);

    if (paymentResult.status === PAYMENT_STATUS.APPROVED) {
        try {
            await useCartStore.getState().clearCart(paymentData.userId);
            toast.success("Payment approved! Order confirmed.");
        } catch (orderError) {
            console.error("Failed to clear cart:", orderError);
            toast.warning("Payment approved but cart clearing failed. Please contact support.");
        }
    } else if (paymentResult.status === PAYMENT_STATUS.DENIED) {
        toast.error(paymentResult.failureReason || "Payment was declined");
    }
};

// =======================
// STORE DEFINITION
// =======================

export const usePaymentStore = create((set, get) => ({
    // =======================
    // STATE
    // =======================

    // Core payment state
    paymentSession: null,
    paymentResult: null,
    paymentHistory: [],

    // Loading states - each operation has its own loading flag
    creatingSession: false,
    processingPayment: false,
    loadingHistory: false,
    canceling: false,

    // Error state
    error: null,

    // =======================
    // STATE MANAGEMENT ACTIONS
    // =======================

    clearError: () => set({ error: null }),

    clearPaymentResult: () => set({ paymentResult: null }),

    resetPaymentFlow: () => set({
        paymentSession: null,
        paymentResult: null,
        error: null,
    }),

    // =======================
    // PAYMENT SESSION MANAGEMENT
    // =======================

    /**
     * Creates a new payment session for the user
     * This is the first step in the payment flow
     * REQUIRES AUTH
     */
    createPaymentSession: async (userId) => {
        set({ creatingSession: true, error: null });

        try {
            const response = await axios.post(
                `${PAYMENT_ENDPOINTS.CREATE_SESSION}?userId=${userId}`,
                {},
                { headers: getAuthHeaders() }
            );

            const paymentSession = {
                userId,
                createdAt: new Date(),
                sessionId: response.data?.sessionId,
            };

            set({
                paymentSession,
                creatingSession: false,
            });

            toast.success("Payment session created!");
            return response.data;

        } catch (error) {
            handleApiError(error, "Failed to create payment session", set, 'creatingSession');
            throw error;
        }
    },

    // =======================
    // PAYMENT PROCESSING
    // =======================

    /**
     * Processes the actual payment with user's payment data
     * Handles both successful and failed payments
     * REQUIRES AUTH
     */
    processPayment: async (paymentData) => {
        set({ processingPayment: true, error: null });

        try {
            const response = await axios.post(PAYMENT_ENDPOINTS.PROCESS_PAYMENT, paymentData, {
                headers: getAuthHeaders()
            });
            const paymentResult = response.data;

            set({
                paymentResult,
                processingPayment: false,
            });

            // Handle post-payment actions (cart clearing, notifications)
            await handleSuccessfulPayment(paymentResult, paymentData);

            return paymentResult;

        } catch (error) {
            handleApiError(error, "Payment processing failed", set, 'processingPayment');
            throw error;
        }
    },

    // =======================
    // PAYMENT INFORMATION RETRIEVAL
    // =======================

    /**
     * Gets the current status of a specific payment/order
     * REQUIRES AUTH
     */
    getPaymentStatus: async (orderId) => {
        set({ loadingHistory: true, error: null });

        try {
            const response = await axios.get(PAYMENT_ENDPOINTS.GET_STATUS(orderId), {
                headers: getAuthHeaders()
            });
            set({ loadingHistory: false });
            return response.data;

        } catch (error) {
            handleApiError(error, "Failed to get payment status", set, 'loadingHistory');
            throw error;
        }
    },

    /**
     * Retrieves all payment history for a specific user
     * REQUIRES AUTH
     */
    getPaymentHistory: async (userId) => {
        set({ loadingHistory: true, error: null });

        try {
            const response = await axios.get(PAYMENT_ENDPOINTS.GET_HISTORY(userId), {
                headers: getAuthHeaders()
            });

            set({
                paymentHistory: response.data,
                loadingHistory: false,
            });

            return response.data;

        } catch (error) {
            handleApiError(error, "Failed to get payment history", set, 'loadingHistory');
            throw error;
        }
    },

    // =======================
    // PAYMENT CANCELLATION
    // =======================

    /**
     * Cancels and refunds a payment
     * Automatically refreshes payment history if available
     * REQUIRES AUTH
     */
    cancelPayment: async (orderId) => {
        set({ canceling: true, error: null });

        try {
            await axios.post(PAYMENT_ENDPOINTS.CANCEL_PAYMENT(orderId), {}, {
                headers: getAuthHeaders()
            });

            set({ canceling: false });
            toast.success("Payment cancelled and refunded successfully");

            // Refresh payment history to show the cancellation
            await get().refreshPaymentHistoryIfAvailable();

        } catch (error) {
            handleApiError(error, "Failed to cancel payment", set, 'canceling');
            throw error;
        }
    },

    // =======================
    // UTILITY ACTIONS
    // =======================

    /**
     * Helper function to refresh payment history if we have user data
     * Used after cancellations to show updated status
     */
    refreshPaymentHistoryIfAvailable: async () => {
        const { paymentHistory, getPaymentHistory } = get();

        if (paymentHistory.length > 0) {
            const firstPayment = paymentHistory[0];
            if (firstPayment.userId) {
                await getPaymentHistory(firstPayment.userId);
            }
        }
    },
}));