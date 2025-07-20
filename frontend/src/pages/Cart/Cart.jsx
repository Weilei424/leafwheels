import OrderSummary from "../../components/cart/OrderSummary.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import EmptyCartUI from "../../components/cart/EmptyCartUI.jsx";
import { useCartStore } from "../../stores/useCartStore.js";
import CartLoanCalculator from "../../components/cart/CartLoanCalculator.jsx";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
    const { cart, getCartItems, removeFromCart, clearCart } = useCartStore();

    React.useEffect(() => {
        getCartItems();
    }, [getCartItems]);

    const transformedCart = React.useMemo(
        () =>
            cart.map((item) => {
                const isVehicle = item.type === "VEHICLE";
                const product = isVehicle ? item.vehicle : item.accessory;

                return {
                    _id: item.id,
                    name: isVehicle
                        ? `${product.year} ${product.make} ${product.model}`
                        : product.name,
                    image: product.imageUrl || null,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    type: item.type,
                };
            }),
        [cart]
    );

    const hasItems = transformedCart.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-7xl mt-10 mx-auto"
        >
            {hasItems && (
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-light text-gray-900 mb-8"
                >
                    Shopping Cart
                </motion.h1>
            )}


            {!hasItems ? (
                <div className="flex justify-center">
                    <EmptyCartUI />
                </div>
            ) : (
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 ">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <motion.div layout className="space-y-4">
                            {/* Clear Cart Button */}
                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={clearCart}
                                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Clear Cart
                                </motion.button>
                            </div>

                            {/* Cart Items */}
                            <AnimatePresence>
                                {transformedCart.map((item) => (
                                    <CartItem key={item._id} item={item} onRemove={removeFromCart} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="mt-8 lg:mt-0 space-y-6">
                        <OrderSummary />
                        <CartLoanCalculator />
                    </div>
                </div>
            )}
        </motion.div>
    );
};
export default CartPage;
