import { useCartStore } from "../stores/useCartStore.js";
import { useUserStore } from "../stores/useUserStore.js";
import {toast} from "react-toastify";


export const handleAddToCart = ({ product, type, quantity = 1 }) => {
    const addToCart = useCartStore.getState().addToCart;
    const user = useUserStore.getState().user;

    if (!user) {
        toast.error("Please sign in to add items to cart.");
        return;
    }

    addToCart({
        id: product.id,
        type,
        userId: user.id,
        quantity
    });
};