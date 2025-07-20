import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const usePaymentStore = create((set, get) => ({
    // Payment state
    paymentSession: null,
    paymentResult: null,
    paymentHistory: [],

    // Loading states
    loading: false,
    processingPayment: false,
    error: null,

    // Clear error
    clearError: () => set({ error: null }),

    // Clear payment result
    clearPaymentResult: () => set({ paymentResult: null }),

    /**
     * Create payment session
     * Endpoint: POST /api/v1/payment/session
     * Validates cart and creates session state
     */
    createPaymentSession: async (userId) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`/api/v1/payment/session?userId=${userId}`);

            set({
                paymentSession: { userId, createdAt: new Date() },
                loading: false
            });

            toast.success("Payment session created!");
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create payment session";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Process payment
     * Endpoint: POST /api/v1/payment/process
     * Creates order and processes payment (67% approval rate)
     */
    processPayment: async (paymentData) => {
        set({ processingPayment: true, error: null });
        try {
            const response = await axios.post("/api/v1/payment/process", paymentData);

            const paymentResult = response.data;
            set({
                paymentResult,
                processingPayment: false
            });

            if (paymentResult.status === 'APPROVED') {
                toast.success("Payment approved! Order confirmed.");
            } else if (paymentResult.status === 'DENIED') {
                toast.error(paymentResult.failureReason || "Payment was declined");
            }

            return paymentResult;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Payment processing failed";
            set({ error: errorMessage, processingPayment: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get payment status for an order
     * Endpoint: GET /api/v1/payment/{orderId}/status
     */
    getPaymentStatus: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/payment/${orderId}/status`);

            set({ loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get payment status";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get user payment history
     * Endpoint: GET /api/v1/payment/user/{userId}
     */
    getPaymentHistory: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/payment/user/${userId}`);

            set({
                paymentHistory: response.data,
                loading: false
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get payment history";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Cancel/refund payment
     * Endpoint: POST /api/v1/payment/{orderId}/cancel
     */
    cancelPayment: async (orderId) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`/api/v1/payment/${orderId}/cancel`);

            set({ loading: false });
            toast.success("Payment cancelled and refunded successfully");

            // Refresh payment history if available
            const { paymentHistory } = get();
            if (paymentHistory.length > 0) {
                const firstPayment = paymentHistory[0];
                if (firstPayment.userId) {
                    get().getPaymentHistory(firstPayment.userId);
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to cancel payment";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },
}));