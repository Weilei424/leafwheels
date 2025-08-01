import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../stores/useOrderStore.js";
import { useUserStore } from "../../stores/useUserStore.js";

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const {
        userOrders,
        loading,
        getOrdersByUser,
        cancelOrder,
        getStatusColor,
        canCancelOrder
    } = useOrderStore();

    useEffect(() => {
        if (user?.id) {
            getOrdersByUser(user.id);
        }
    }, [user?.id, getOrdersByUser]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await cancelOrder(orderId);
            } catch (error) {
                console.error("Failed to cancel order:", error);
            }
        }
    };

    const handleViewDetails = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Please log in to view your orders
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen  py-8"
        >
            <div className="max-w-4xl mx-auto px-4 mt-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <button
                        onClick={() => navigate("/store")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </motion.div>

                {userOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 bg-white rounded-xl border border-gray-100"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">When you make your first purchase, it will appear here.</p>
                        <button
                            onClick={() => navigate("/store")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {userOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mb-4">
                                        <div className="space-y-2">
                                            {order.items.slice(0, 2).map((item) => {
                                                // Handle nested structure (vehicle or accessory)
                                                const isVehicle = item.type === "VEHICLE";
                                                const product = isVehicle ? item.vehicle : item.accessory;
                                                const itemName = isVehicle
                                                    ? `${product?.year} ${product?.make} ${product?.model}`
                                                    : product?.name || 'Item';

                                                return (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="text-gray-700">{itemName}</span>
                                                        <span className="text-gray-600">
                                                            ${item.unitPrice?.toLocaleString()} × {item.quantity}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-gray-500">
                                                    +{order.items.length - 2} more item{order.items.length > 3 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewDetails(order.id)}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                                        >
                                            View Details
                                        </button>

                                        {canCancelOrder(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>

                                    <span className="text-lg font-semibold text-gray-900">
                                        ${order.totalPrice?.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrderHistoryPage;