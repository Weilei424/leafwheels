import { useMemo } from "react";

export const useCartTransformation = (cart) => {
    return useMemo(() => {
        return cart
            .map(transformCartItem)
            .filter(Boolean); // Remove any null items
    }, [cart]);
};

// Helper function to transform individual cart items
const transformCartItem = (item) => {
    const isVehicle = item.type === "VEHICLE";
    const product = isVehicle ? item.vehicle : item.accessory;

    if (!product) return null;

    const {
        id,
        year,
        make,
        model,
        name,
        imageUrls,
        imageUrl,
        price,
        discountPrice,
        discountPercentage,
        onDeal,
    } = product;

    return {
        _id: item.id,
        productId: id,
        name: isVehicle ? `${year} ${make} ${model}` : name,
        image: imageUrls?.[0] || imageUrl || null,
        price,
        discountPrice,
        discountPercentage,
        onDeal,
        quantity: item.quantity,
        type: item.type,
    };
};