import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useCartStore = create((set, get) => ({
    cart: [],
    subtotal: 0,
    total: 0,
    tax: 0,
    shipping: 0,
    savings: 0,
    loading: false,
    error: null,

    checkout: {
        shippingMethod: null,
        paymentMethod: null,
        step: 1,
    },

    setCheckoutStep: (step) => {
        set((state) => ({
            checkout: { ...state.checkout, step },
        }));
    },

    setShippingMethod: (method) => {
        set((state) => ({
            checkout: { ...state.checkout, shippingMethod: method },
        }));
    },

    setPaymentMethod: (method) => {
        set((state) => ({
            checkout: { ...state.checkout, paymentMethod: method },
        }));
    },

    clearError: () => set({ error: null }),

    getCartItems: async () => {
        set({ loading: true, error: null });
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";
            const response = await axios.get(`/api/v1/carts/${userId}`);

            const cartData = response.data;
            const items = cartData?.items || [];

            set({
                cart: items,
                loading: false
            });

            get().calculateTotals();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to load cart.";
            set({
                cart: [],
                error: errorMessage,
                loading: false
            });
            toast.error(errorMessage);
        }
    },

    addToCart: async ({ id, type }) => {
        set({ loading: true, error: null });
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";

            let payload = { type };

            if (type === "VEHICLE") {
                payload.vehicleId = id;
            } else if (type === "ACCESSORY") {
                payload.accessoryId = id;
            }

            const response = await axios.post(`/api/v1/carts/${userId}/items`, payload);

            const cartData = response.data;
            const items = cartData?.items || [];

            set({
                cart: items,
                loading: false
            });

            get().calculateTotals();
            toast.success("Item added to cart.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add item.";
            set({
                error: errorMessage,
                loading: false
            });
            toast.error(errorMessage);
        }
    },

    removeFromCart: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";
            const response = await axios.delete(`/api/v1/carts/${userId}/items/${itemId}`);

            const cartData = response.data;
            const items = cartData?.items || [];

            set({
                cart: items,
                loading: false
            });

            get().calculateTotals();
            toast.success("Item removed.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to remove item.";
            set({
                error: errorMessage,
                loading: false
            });
            toast.error(errorMessage);
        }
    },

    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";
            await axios.delete(`/api/v1/carts/${userId}`);

            set({
                cart: [],
                subtotal: 0,
                total: 0,
                tax: 0,
                shipping: 0,
                savings: 0,
                loading: false
            });

            toast.success("Cart cleared.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to clear cart.";
            set({
                error: errorMessage,
                loading: false
            });
            toast.error(errorMessage);
        }
    },

    /**
     * Centralized calculation for all cart totals
     * Includes subtotal, tax, shipping, savings, and final total
     */
    calculateTotals: () => {
        const { cart } = get();

        // Calculate subtotal from cart items
        const subtotal = cart.reduce((acc, item) => {
            const price = item.unitPrice || 0;
            const quantity = item.quantity || 1;
            return acc + (price * quantity);
        }, 0);

        // Calculate additional charges
        const savings = 0; // Placeholder for future discounts/coupons
        const shipping = 0; // Free shipping
        const tax = subtotal * 0.13; // 13% tax rate

        // Calculate final total
        const total = subtotal - savings + shipping + tax;

        set({
            subtotal,
            tax,
            shipping,
            savings,
            total
        });
    },
}));