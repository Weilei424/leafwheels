import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useOrderStore } from "./useOrderStore.js";


export const usePaymentStore = create((set, get) => ({
    // Payment state
    paymentSession: null,
    paymentResult: null,
    paymentHistory: [],

    // Loading states - specific and clear
    creatingSession: false,
    processingPayment: false,
    loadingHistory: false,
    canceling: false,
    error: null,

    // Clear functions
    clearError: () => set({ error: null }),
    clearPaymentResult: () => set({ paymentResult: null }),
    resetPaymentFlow: () => set({
        paymentSession: null,
        paymentResult: null,
        error: null
    }),

    /**
     * Create payment session
     * Endpoint: POST /api/v1/payment/session
     */
    createPaymentSession: async (userId) => {
        set({ creatingSession: true, error: null });
        try {
            const response = await axios.post(`/api/v1/payment/session?userId=${userId}`);

            set({
                paymentSession: {
                    userId,
                    createdAt: new Date(),
                    sessionId: response.data?.sessionId
                },
                creatingSession: false
            });

            toast.success("Payment session created!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create payment session";
            set({ error: errorMessage, creatingSession: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Process payment
     * Endpoint: POST /api/v1/payment/process
     */
    /**
     * Process payment - UPDATED with order creation
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
                try {
                    // Create order from cart
                    await useOrderStore.getState().createOrderFromCart(paymentData.userId);
                    toast.success("Payment approved! Order confirmed.");
                } catch (orderError) {
                    console.error("Failed to create order:", orderError);
                    // Payment succeeded but order creation failed - needs manual handling
                    toast.warning("Payment approved but order creation failed. Please contact support.");
                }
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
        set({ loadingHistory: true, error: null });
        try {
            const response = await axios.get(`/api/v1/payment/${orderId}/status`);
            set({ loadingHistory: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get payment status";
            set({ error: errorMessage, loadingHistory: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get user payment history
     * Endpoint: GET /api/v1/payment/user/{userId}
     */
    getPaymentHistory: async (userId) => {
        set({ loadingHistory: true, error: null });
        try {
            const response = await axios.get(`/api/v1/payment/user/${userId}`);

            set({
                paymentHistory: response.data,
                loadingHistory: false
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get payment history";
            set({ error: errorMessage, loadingHistory: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Cancel/refund payment
     * Endpoint: POST /api/v1/payment/{orderId}/cancel
     */
    cancelPayment: async (orderId) => {
        set({ canceling: true, error: null });
        try {
            await axios.post(`/api/v1/payment/${orderId}/cancel`);

            set({ canceling: false });
            toast.success("Payment cancelled and refunded successfully");

            // Refresh payment history if available
            const { paymentHistory } = get();
            if (paymentHistory.length > 0) {
                const firstPayment = paymentHistory[0];
                if (firstPayment.userId) {
                    await get().getPaymentHistory(firstPayment.userId);
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to cancel payment";
            set({ error: errorMessage, canceling: false });
            toast.error(errorMessage);
            throw error;
        }
    },
}));