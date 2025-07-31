import React, {useCallback} from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import OrderSummary from "../../components/cart/OrderSummary.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import EmptyCartUI from "../../components/cart/EmptyCartUI.jsx";
import CartLoanCalculator from "../../components/cart/CartLoanCalculator.jsx";
import { useCartTransformation } from "../../hooks/useCartTransformation.js"; // adjust path if needed


const CartPage = () => {
    const { user } = useUserStore();
    const {
        cart,
        getCartItems,
        removeFromCart,
        clearCart,
        incrementAccessoryInCart,
        decrementAccessoryInCart,
        loading
    } = useCartStore();

    React.useEffect(() => {
        if (user) {
            getCartItems(user.id);
        }
    }, [getCartItems, user]);

    // utility function
    const transformedCart = useCartTransformation(cart);

    const handleUpdateQuantity = useCallback((accessoryId, change) => {
        if (change > 0) {
            incrementAccessoryInCart(user.id, accessoryId);
        } else if (change < 0) {
            decrementAccessoryInCart(user.id, accessoryId);
        }
    }, [user?.id, incrementAccessoryInCart, decrementAccessoryInCart]);

    const handleRemove = useCallback((itemId) => {
        if (user?.id) {
            removeFromCart(user.id, itemId);
        }
    }, [user?.id, removeFromCart]);

    const handleClearCart = useCallback(() => {
        if (user?.id) {
            clearCart(user.id);
        }
    }, [user?.id, clearCart]);

    const hasItems = cart.length > 0;

    // Loading state
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto"
                    />
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-7xl mt-10 mx-auto"
        >
            {/* User Welcome & Cart Header */}
            {hasItems && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900">
                                Shopping Cart
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Welcome back, {user?.firstName}! You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart.
                            </p>
                        </div>

                        {/* Clear Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClearCart}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Clear Cart
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {!hasItems ? (
                <div className="flex justify-center">
                    <EmptyCartUI />
                </div>
            ) : (
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                                {transformedCart.map((item) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onRemove={handleRemove}
                                        onUpdateQuantity={handleUpdateQuantity}
                                    />
                                ))}
                        </div>
                    </div>


                    {/* Sidebar */}
                    <div className="mt-8 lg:mt-0 space-y-6">
                        {/* User Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-medium">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </motion.div>

                        <OrderSummary />
                        <CartLoanCalculator />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CartPage;