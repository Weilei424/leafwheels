import { useEffect, useMemo } from "react";
import OrderSummary from "../../components/cart/OrderSummary.jsx";
import PeopleAlsoBought from "../../components/cart/PeopleAlsoBought.jsx";
import GiftCouponCard from "../../components/cart/GiftCardCoupon.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import EmptyCartUI from "../../components/cart/EmptyCartUI.jsx";
import { useCartStore } from "../../stores/useCartStore.js";

const CartPage = () => {
    const { cart, getCartItems, removeFromCart, clearCart } = useCartStore();

    // Fetch cart items on mount
    useEffect(() => {
        getCartItems();
    }, [getCartItems]);

    // Transform cart items for rendering
    const transformedCart = useMemo(
        () =>
            cart.map((item) => {
                const isVehicle = item.type === "VEHICLE";
                const product = isVehicle ? item.vehicle : item.accessory;

                return {
                    _id: item.id,
                    name: isVehicle
                        ? `${product.year} ${product.make} ${product.model}`
                        : product.name,
                    image: null,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    type: item.type,
                };
            }),
        [cart]
    );

    const hasItems = transformedCart.length > 0;

    return (
        <div className="py-8 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 sm:text-3xl">
                    Your Shopping Cart
                </h1>

                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                        {!hasItems ? (
                            <EmptyCartUI />
                        ) : (
                            <>
                                <button
                                    onClick={clearCart}
                                    className="mb-6 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                    aria-label="Clear all items from cart"
                                >
                                    Clear Cart
                                </button>

                                <div className="space-y-6">
                                    {transformedCart.map((item) => (
                                        <CartItem key={item._id} item={item} onRemove={removeFromCart} />
                                    ))}
                                </div>

                                <PeopleAlsoBought products={[]} />
                            </>
                        )}
                    </div>

                    {hasItems && (
                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <OrderSummary />
                            <GiftCouponCard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
