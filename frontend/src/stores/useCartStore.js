import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useCartStore = create((set, get) => ({
    cart: [],
    subtotal: 0,
    total: 0,

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


            // Use backend total if available, otherwise calculate
            set({ total: cartData.totalPrice });
            get().calculateOtherTotals(); // Calculate subtotal, savings

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to load cart.";
            set({ cart: [], loading: false });
            toast.error(errorMessage);
        }
    },

    addToCart: async ({ id, type, userId, quantity = 1 }) => {
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
                payload.quantity = quantity;
            }

            const response = await axios.post(`/api/v1/carts/${userId}/items`, payload);
            const cartData = response.data;
            const items = cartData?.items || [];

            set({ cart: items, loading: false });


            // Use backend total if available
            set({ total: cartData.totalPrice });
            get().calculateOtherTotals();

            toast.success(`${quantity > 1 ? `${quantity} items` : 'Item'} added to cart.`);
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
            set({ total: cartData.totalPrice });
            get().calculateOtherTotals();

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
     * Calculate subtotal, and savings when backend provides total
     */
    calculateOtherTotals: () => {
        let { cart, total } = get();


        let subtotal = 0;
        let savings = 0;

        cart.forEach((item) => {
            const quantity = item.quantity || 1;
            const product = item.type === "VEHICLE" ? item.vehicle : item.accessory;

            if (!product) return;

            const finalPrice = product.discountPrice
            const originalPrice = product.price || 0;


            subtotal += finalPrice * quantity;

            if (originalPrice > finalPrice) {
                savings += (originalPrice - finalPrice) * quantity;
            }
        });



        set({ subtotal, savings, total });
    },

    updateAccessoryQuantity: async (userId, accessoryId, change) => {
        const { cart } = get();
        const cartItem = cart.find(item =>
            item.type === "ACCESSORY" && item.accessory?.id === accessoryId
        );


        const newQuantity = cartItem.quantity + change;
        if (newQuantity < 1) return;

        try {

            await axios.delete(`/api/v1/carts/${userId}/items/${cartItem.id}`);

            const response = await axios.post(`/api/v1/carts/${userId}/items`, {
                type: "ACCESSORY",
                accessoryId,
                quantity: newQuantity
            });

            const cartData = response.data;
            const items = cartData?.items || [];


            set({ cart: items });
            set({ total: cartData.totalPrice });
            get().calculateOtherTotals();

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    },

    incrementAccessoryInCart: async (userId, accessoryId) => {
        await get().updateAccessoryQuantity(userId, accessoryId, 1);
    },

    decrementAccessoryInCart: async (userId, accessoryId) => {
        await get().updateAccessoryQuantity(userId, accessoryId, -1);
    },
}));