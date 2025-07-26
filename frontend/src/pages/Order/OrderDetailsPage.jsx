import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderStore } from "../../stores/useOrderStore.js";
import { useUserStore } from "../../stores/useUserStore.js";

const OrderDetailsPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user } = useUserStore();
    const {
        currentOrder,
        loading,
        getOrderById,
        cancelOrder,
        getStatusColor,
        canCancelOrder,
        clearCurrentOrder
    } = useOrderStore();

    useEffect(() => {
        if (orderId) {
            getOrderById(orderId);
        }

        // Cleanup on unmount
        return () => {
            clearCurrentOrder();
        };
    }, [orderId, getOrderById, clearCurrentOrder]);

    const handleCancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await cancelOrder(orderId);
            } catch (error) {
                console.error("Failed to cancel order:", error);
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Please log in to view order details
                    </h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full"
                />
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                    <button
                        onClick={() => navigate("/profile/orders")}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }
    console.log("here",  currentOrder)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen mt-10 py-8"
        >
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate("/profile/orders")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order #{currentOrder.id.toUpperCase()}
                        </h1>
                    </div>

                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>
                        {currentOrder.status}
                    </span>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>

                        {currentOrder.items && currentOrder.items.length > 0 ? (
                            <div className="space-y-4">
                                {currentOrder.items.map((item, index) => {
                                    // Handle nested structure (vehicle or accessory)
                                    const isVehicle = item.type === "VEHICLE";
                                    const product = isVehicle ? item.vehicle : item.accessory;
                                    const itemName = isVehicle
                                        ? `${product?.year} ${product?.make} ${product?.model}`
                                        : product?.name || 'Product';

                                    // Check if item has discount
                                    const isDiscounted = product?.onDeal &&
                                        product?.discountPercentage > 0 &&
                                        product?.discountPrice < item.unitPrice;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {itemName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                {/* Show additional vehicle/accessory details */}
                                                {isVehicle && product && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {product.trim && `${product.trim} • `}
                                                        {product.exteriorColor && `${product.exteriorColor} • `}
                                                        {product.condition}
                                                    </div>
                                                )}
                                                {isDiscounted && (
                                                    <p className="text-xs text-green-600 font-medium mt-1">
                                                        {product.discountPercentage}% OFF
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {isDiscounted ? (
                                                    <>
                                                        <p className="font-semibold text-green-600">
                                                            ${product.discountPrice?.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-500 line-through">
                                                            ${item.unitPrice?.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-600">each</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold text-gray-900">
                                                            ${item.unitPrice?.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">each</p>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-600">No items found for this order.</p>
                        )}
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit"
                    >
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3">


                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(currentOrder.status)}`}>
                                    {currentOrder.status}
                                </span>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-medium text-gray-900">Total</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ${currentOrder.totalPrice?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 space-y-3">
                            {canCancelOrder(currentOrder.status) && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCancelOrder}
                                    className="w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Cancel Order
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/store")}
                                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Continue Shopping
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetailsPage;