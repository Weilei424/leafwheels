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
    clearOrders: () => set({ orders: [] }),
    clearCurrentOrder: () => set({ currentOrder: null }),
    clearUserOrders: () => set({ userOrders: [] }),

    /**
     * Create a new order
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
            set({ error: errorMessage, loading: false });
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
     * Create order from cart
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

            toast.success("Order created from cart successfully!");
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
     * Helper function to get order status color
     */
    getOrderStatusColor: (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED':
                return 'text-blue-600 bg-blue-100';
            case 'PAID':
                return 'text-green-600 bg-green-100';
            case 'SHIPPED':
                return 'text-indigo-600 bg-indigo-100';
            case 'DELIVERED':
                return 'text-green-700 bg-green-200';
            case 'CANCELED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    },

    /**
     * Helper function to get order status text
     */
    getOrderStatusText: (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED':
                return 'Placed';
            case 'PAID':
                return 'Paid';
            case 'SHIPPED':
                return 'Shipped';
            case 'DELIVERED':
                return 'Delivered';
            case 'CANCELED':
                return 'Cancelled';
            default:
                return status || 'Unknown';
        }
    },

    /**
     * Helper function to check if order can be cancelled
     */
    canCancelOrder: (order) => {
        const cancelableStatuses = ['PLACED', 'PAID'];
        return cancelableStatuses.includes(order.status?.toUpperCase());
    },

    /**
     * Helper function to calculate order totals
     */
    calculateOrderTotals: (order) => {
        if (!order || !order.items) {
            return {
                itemsCount: 0,
                subtotal: 0,
                tax: 0,
                total: 0
            };
        }

        const itemsCount = order.items.length;
        const subtotal = order.items.reduce((sum, item) => {
            const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : (item.unitPrice || 0);
            const quantity = item.quantity || 1;
            return sum + (unitPrice * quantity);
        }, 0);

        // Assuming tax is included in totalPrice or calculate if needed
        const total = typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice) : (order.totalPrice || subtotal);
        const tax = total - subtotal; // This assumes tax is the difference

        return {
            itemsCount,
            subtotal: subtotal.toFixed(2),
            tax: Math.max(0, tax).toFixed(2),
            total: total.toFixed(2)
        };
    },

    /**
     * Helper function to format order date
     */
    formatOrderDate: (dateString) => {
        if (!dateString) return 'Unknown';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    },

    /**
     * Helper function to get orders by status
     */
    getOrdersByStatus: (status) => {
        const { userOrders } = get();
        return userOrders.filter(order =>
            order.status?.toUpperCase() === status?.toUpperCase()
        );
    },

    /**
     * Helper function to get recent orders
     */
    getRecentOrders: (limit = 5) => {
        const { userOrders } = get();
        return [...userOrders]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, limit);
    },
}));