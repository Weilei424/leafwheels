import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useCartStore = create((set, get) => ({
    cart: [],
    subtotal: 0,
    total: 0,
    tax: 0,
    savings: 0,
    loading: false,

    getCartItems: async (userId) => {
        if (!userId) return;

        set({ loading: true });
        try {
            const response = await axios.get(`/api/v1/carts/${userId}`);
            const cartData = response.data;
            const items = cartData?.items || [];

            set({ cart: items, loading: false });
            get().calculateTotals();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to load cart.";
            set({ cart: [], loading: false });
            toast.error(errorMessage);
        }
    },

    addToCart: async ({ id, type, userId }) => {
        if (!userId) {
            toast.error("Please log in to add items to cart");
            return;
        }

        set({ loading: true });
        try {
            let payload = { type };

            if (type === "VEHICLE") {
                payload.vehicleId = id;
            } else if (type === "ACCESSORY") {
                payload.accessoryId = id;
            }

            const response = await axios.post(`/api/v1/carts/${userId}/items`, payload);
            const cartData = response.data;
            const items = cartData?.items || [];

            set({ cart: items, loading: false });
            get().calculateTotals();
            toast.success("Item added to cart.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add item.";
            set({ loading: false });
            toast.error(errorMessage);
        }
    },

    removeFromCart: async (userId, itemId) => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        set({ loading: true });
        try {
            const response = await axios.delete(`/api/v1/carts/${userId}/items/${itemId}`);
            const cartData = response.data;
            const items = cartData?.items || [];

            set({ cart: items, loading: false });
            get().calculateTotals();
            toast.success("Item removed.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to remove item.";
            set({ loading: false });
            toast.error(errorMessage);
        }
    },

    clearCart: async (userId) => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        set({ loading: true });
        try {
            await axios.delete(`/api/v1/carts/${userId}`);

            set({
                cart: [],
                subtotal: 0,
                total: 0,
                tax: 0,
                savings: 0,
                loading: false
            });

            toast.success("Cart cleared.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to clear cart.";
            set({ loading: false });
            toast.error(errorMessage);
        }
    },

    /**
     * Calculate cart totals with discounts
     * Tax is calculated on final discounted price (13% flat rate)
     */
    calculateTotals: () => {
        const { cart } = get();

        let subtotal = 0;
        let savings = 0;

        cart.forEach((item) => {
            const quantity = item.quantity || 1;
            const unitPrice = item.unitPrice || 0;

            // Get the actual item (vehicle or accessory) based on type
            const actualItem = item.type === "VEHICLE" ? item.vehicle : item.accessory;

            if (!actualItem) {
                // Fallback if no nested item
                subtotal += unitPrice * quantity;
                return;
            }

            // Check if item is discounted
            const discountPrice = actualItem.discountPrice || 0
            const originalPrice = actualItem.price || unitPrice
            const discountPercentage = actualItem.discountPercentage || 0
            const onDeal = actualItem.onDeal;

            const isDiscounted = onDeal && discountPercentage > 0 && discountPrice > 0 && discountPrice < originalPrice;

            const finalPrice = isDiscounted ? discountPrice : unitPrice;
            subtotal += finalPrice * quantity;

            if (isDiscounted) {
                savings += (unitPrice - discountPrice) * quantity;
            }
        });

        // Tax calculated on discounted subtotal (13% flat rate)
        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        set({
            subtotal,
            tax,
            savings,
            total
        });
    }
}));