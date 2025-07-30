import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

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
     * Endpoint: POST /api/v1/orders/{userId}
     * Body: CreateOrderRequestDto
     */
    createOrder: async (userId, orderData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/orders/${userId}`, orderData);

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
     * Endpoint: GET /api/v1/orders/{orderId}
     */
    getOrderById: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/orders/${orderId}`);

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
     * Endpoint: GET /api/v1/orders/user/{userId}
     */
    getOrdersByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/orders/user/${userId}`);

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
     * Create order from cart - ✅ THIS IS WHAT WE USE IN PAYMENT FLOW
     * Endpoint: POST /api/v1/orders/from-cart/{userId}
     */
    createOrderFromCart: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/orders/from-cart/${userId}`);

            set((prevState) => ({
                orders: [response.data, ...prevState.orders],
                currentOrder: response.data,
                userOrders: [response.data, ...prevState.userOrders],
                loading: false,
            }));

            toast.success("Order created successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create order from cart";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Cancel an order
     * Endpoint: POST /api/v1/orders/{orderId}/cancel
     */
    cancelOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`/api/v1/orders/${orderId}/cancel`);

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