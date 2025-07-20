import { useCartStore } from "../stores/useCartStore.js";

export const handleAddToCart = ({ product, type }) => {
    const addToCart = useCartStore.getState().addToCart;
        addToCart({ id: product.id, type });
};
