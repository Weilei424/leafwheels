import { useCartStore } from "../stores/useCartStore.js";
import { useUserStore } from "../stores/useUserStore.js";

export const handleAddToCart = ({ product, type }) => {
    const addToCart = useCartStore.getState().addToCart;
    const user = useUserStore.getState().user;
    
    if (!user) {
        console.error("User not authenticated");
        return;
    }
    
    addToCart({ id: product.id, type, userId: user.id });
};
