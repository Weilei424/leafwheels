import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "./useUserStore";

// Helper function to get auth headers for authenticated operations
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const useOrderStore = create((set, get) => ({
    // State
    orders: [],
    currentOrder: null,
    userOrders: [],
    loading: false,
    error: null,

    // Clear functions
    clearError: () => set({ error: null }),
    clearCurrentOrder: () => set({ currentOrder: null }),

    /**
     * Create a new order with specific items
     * Endpoint: POST /api/v1/orders/{userId} - REQUIRES AUTH
     * Body: CreateOrderRequestDto
     */
    createOrder: async (userId, orderData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/orders/${userId}`, orderData, {
                headers: getAuthHeaders()
            });

            set((prevState) => ({
                orders: [response.data, ...prevState.orders],
                currentOrder: response.data,
                loading: false,
            }));

            toast.success("Order created successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create order";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get order by ID
     * Endpoint: GET /api/v1/orders/{orderId} - REQUIRES AUTH
     */
    getOrderById: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/orders/${orderId}`, {
                headers: getAuthHeaders()
            });

            set({
                currentOrder: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch order";
            set({ error: errorMessage, loading: false, currentOrder: null });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get orders for a user
     * Endpoint: GET /api/v1/orders/user/{userId} - REQUIRES AUTH
     */
    getOrdersByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/orders/user/${userId}`, {
                headers: getAuthHeaders()
            });

            set({
                userOrders: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch user orders";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Cancel an order
     * Endpoint: POST /api/v1/orders/{orderId}/cancel - REQUIRES AUTH
     */
    cancelOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`/api/v1/orders/${orderId}/cancel`, {}, {
                headers: getAuthHeaders()
            });

            set((prevState) => ({
                orders: prevState.orders.map(order =>
                    order.id === orderId ? { ...order, status: 'CANCELED' } : order
                ),
                userOrders: prevState.userOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'CANCELED' } : order
                ),
                currentOrder: prevState.currentOrder?.id === orderId
                    ? { ...prevState.currentOrder, status: 'CANCELED' }
                    : prevState.currentOrder,
                loading: false,
            }));

            toast.success("Order cancelled successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to cancel order";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Helper function to get status color for UI
     */
    getStatusColor: (status) => {
        switch (status) {
            case 'PLACED':
                return 'bg-blue-100 text-blue-800';
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-emerald-100 text-emerald-800';
            case 'CANCELED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    },

    /**
     * Helper function to check if order can be cancelled
     */
    canCancelOrder: (status) => {
        return ['PLACED', 'PAID'].includes(status);
    }
}));