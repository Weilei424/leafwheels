import { useCartStore } from "../stores/useCartStore.js";
import { useUserStore } from "../stores/useUserStore.js";

export const handleAddToCart = ({ product, type, quantity = 1 }) => {
    const addToCart = useCartStore.getState().addToCart;
    const user = useUserStore.getState().user;

    if (!user) {
        console.error("User not authenticated");
        return;
    }

    addToCart({
        id: product.id,
        type,
        userId: user.id,
        quantity
    });
};