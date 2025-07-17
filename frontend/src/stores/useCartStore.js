import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

// Assumes user ID is stored in localStorage after authentication.
// Replace with a more robust method (e.g. auth context) in a production environment.
//const getUserId = () => localStorage.getItem("userId");

export const useCartStore = create((set, get) => ({
    /**
     * - `cart` holds the raw product data.
     * - `subtotal` and `total` are derived from the contents of the cart.
     */
    cart: [],
    subtotal: 0,
    total: 0,

    /**
     * Stores the current state of the checkout process.
     * Supports multi-step flows and allows the UI to remain reactive to user selections.
     */
    checkout: {
        shippingMethod: null,
        paymentMethod: null,
        step: 1, // Used to drive UI progression (e.g. stepper component).
    },

    /**
     * Updates the current step in the multi-step checkout process.
     * This should be called whenever the user advances or goes back a step.
     */
    setCheckoutStep: (step) => {
        set((state) => ({
            checkout: { ...state.checkout, step },
        }));
    },

    /**
     * Saves the shipping method selected by the user.
     * Useful for recalculating totals or pre-filling data on review pages.
     */
    setShippingMethod: (method) => {
        set((state) => ({
            checkout: { ...state.checkout, shippingMethod: method },
        }));
    },

    /**
     * Saves the payment method selected by the user.
     * Should be triggered after the user confirms a choice (e.g. Credit Card, PayPal).
     */
    setPaymentMethod: (method) => {
        set((state) => ({
            checkout: { ...state.checkout, paymentMethod: method },
        }));
    },

    /**
     * Fetches the current contents of the user's cart from the backend.
     * This function is typically called:
     * - On initial load
     * - After login
     * - After a change (add/remove/clear) to ensure sync with backend
     */
    getCartItems: async () => {
        try {
            // const userId = getUserId();
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1"
            const res = await axios.get(`/api/v1/carts/${userId}`);

            const items = res.data?.items || [];
            set({ cart: items });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response?.data?.message || "Failed to load cart.");
        }
    },

    /**
     * Adds an item to the user's cart.
     * Payload includes both the product ID and its type (e.g., "VEHICLE", "ACCESSORY").
     * Assumes backend uses UUID-based route: POST `/cart/{userId}/items`
     */
    addToCart: async ({ id, type }) => {
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";
            // Dynamically build payload key based on type
            let payload = { type };

            if (type === "VEHICLE") {
                payload.vehicleId = id;
            } else {
                payload.accessoryId = id;
            }

            const res = await axios.post(`/api/v1/carts/${userId}/items`, payload);
            set({ cart: res.data.items });
            get().calculateTotals();
            toast.success("Item added to cart.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add item.");
        }
    },


    //
    // /**
    //  * Removes an item from the cart using its unique item ID.
    //  * This reflects directly in the cart backend, ensuring the frontend mirrors the true state.
    //  */
    removeFromCart: async (itemId) => {
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1"
            const res = await axios.delete(`/api/v1/carts/${userId}/items/${itemId}`);

            set({ cart: res.data.items });
            get().calculateTotals();
            toast.success("Item removed.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item.");
        }
    },

    /**
     * Clears all items from the cart.
     * Typically triggered after an order is placed or if the user explicitly empties the cart.
     */
    clearCart: async () => {
        try {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1";
            await axios.delete(`/api/v1/carts/${userId}`);

            set({ cart: [], subtotal: 0, total: 0 });
            toast.success("Cart cleared.");
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to clear cart.");
        }
    },

    /**
     * Derives subtotal and total from the current cart contents.
     * This function is central to ensuring accurate pricing throughout the UI.
     * Extend this later to support:
     * - Taxes
     * - Shipping costs
     * - Discounts or coupons
     */
    calculateTotals: () => {
        const { cart } = get();

        const subtotal = cart.reduce((acc, item) => {
            const price = item.price;
            const quantity = item.quantity || 1;
            return acc + price * quantity;
        }, 0);

        const total = subtotal; // Placeholder: extend as needed

        set({ subtotal, total });
    },
}));
