import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "./useUserStore";

const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const useCartStore = create((set, get) => ({
    cart: [],
    subtotal: 0,
    total: 0,
    savings: 0,
    loading: false,

    // Helper to update cart state from backend response
    updateCartState: (cartData) => {
        const items = cartData?.items || [];
        set({ cart: items, total: cartData.totalPrice });
        get().computeSubtotalAndSavings();
    },

    getCartItems: async (userId) => {
        if (!userId) return;
        set({ loading: true });

        try {
            const response = await axios.get(`/api/v1/carts/${userId}`, {
                headers: getAuthHeaders(),
            });
            get().updateCartState(response.data);
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.message || "Failed to load cart.");
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async ({ id, type, userId, quantity = 1 }) => {
        if (!userId) {
            toast.error("Please log in to add items to cart");
            return;
        }

        set({ loading: true });
        try {
            const payload = { type };
            if (type === "VEHICLE") payload.vehicleId = id;
            if (type === "ACCESSORY") Object.assign(payload, { accessoryId: id, quantity });

            const response = await axios.post(`/api/v1/carts/${userId}/items`, payload, {
                headers: getAuthHeaders(),
            });
            get().updateCartState(response.data);
            toast.success(`${quantity > 1 ? `${quantity} items` : "Item"} added to cart.`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add item.");
        } finally {
            set({ loading: false });
        }
    },

    removeFromCart: async (userId, itemId) => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        set({ loading: true });
        try {
            const response = await axios.delete(`/api/v1/carts/${userId}/items/${itemId}`, {
                headers: getAuthHeaders(),
            });
            get().updateCartState(response.data);
            toast.success("Item removed.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item.");
        } finally {
            set({ loading: false });
        }
    },

    clearCart: async (userId) => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        set({ loading: true });
        try {
            const response = await axios.delete(`/api/v1/carts/${userId}`, {
                headers: getAuthHeaders(),
            });
            get().updateCartState(response.data);
            set({ subtotal: 0, savings: 0 });
            toast.success("Cart cleared.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart.");
        } finally {
            set({ loading: false });
        }
    },

    incrementAccessoryInCart: async (userId, accessoryId) => {
        try {
            const response = await axios.put(
                `/api/v1/carts/${userId}/accessories/${accessoryId}/increment`,
                { userId, accessoryId },
                { headers: getAuthHeaders() }
            );
            get().updateCartState(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to increment quantity");
        }
    },

    decrementAccessoryInCart: async (userId, accessoryId) => {
        try {
            const response = await axios.put(
                `/api/v1/carts/${userId}/accessories/${accessoryId}/decrement`,
                { userId, accessoryId },
                { headers: getAuthHeaders() }
            );
            get().updateCartState(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to decrement quantity");
        }
    },

    computeSubtotalAndSavings: () => {
        const { cart } = get();
        let subtotal = 0;
        let savings = 0;

        cart.forEach((item) => {
            const quantity = item.quantity || 1;
            const product = item.type === "VEHICLE" ? item.vehicle : item.accessory;

            if (!product) return;

            const finalPrice = product.discountPrice || 0;
            const originalPrice = product.price || 0;

            subtotal += finalPrice * quantity;
            if (originalPrice > finalPrice) {
                savings += (originalPrice - finalPrice) * quantity;
            }
        });

        set({ subtotal, savings });
    },
}));
