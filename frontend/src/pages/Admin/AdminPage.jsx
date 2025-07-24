import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { useOrderStore } from "../../stores/useOrderStore.js";
import { usePaymentStore } from "../../stores/usePaymentStore.js";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { useUserStore } from "../../stores/useUserStore.js";

// ================= COMPONENTS =================

const StatCard = ({ title, value, icon, color = "green", trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm">{title}</p>
                <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                {trend && (
                    <p className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? '+' : ''}{trend}% from last month
                    </p>
                )}
            </div>
            <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    </motion.div>
);

const SimpleTable = ({ title, headers, data, onEdit, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {header}
                        </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                    <motion.tr
                        key={item.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                    >
                        {headers.map((header, headerIndex) => (
                            <td key={headerIndex} className="px-6 py-4 text-sm text-gray-900">
                                {item[header.toLowerCase().replace(' ', '')]}
                            </td>
                        ))}
                        <td className="px-6 py-4 text-right text-sm space-x-2">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            )}
                        </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
        { id: 'orders', name: 'Orders', icon: '📦' },
        { id: 'payments', name: 'Payments', icon: '💳' },
        { id: 'reviews', name: 'Reviews', icon: '⭐' },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-white border-r border-gray-100 h-full"
        >
            <div className="p-6 py-10">
                <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            </div>
            <nav className="px-3">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left mb-1 transition-colors ${
                            activeTab === tab.id
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.name}
                    </motion.button>
                ))}
            </nav>
        </motion.div>
    );
};

// ================= MAIN ADMIN COMPONENT =================

const AdminPage = () => {
    const { user } = useUserStore();
    const { vehicles, getAllVehicles, deleteVehicle, loading: vehicleLoading } = useVehicleStore();
    const { orders, getOrdersByUser, loading: orderLoading } = useOrderStore();
    const { paymentHistory, getPaymentHistory, loading: paymentLoading } = usePaymentStore();
    const { reviews, getAllReviews, deleteReview, loading: reviewLoading } = useReviewStore();

    const [activeTab, setActiveTab] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Load data on mount
    useEffect(() => {
        getAllVehicles();
        getAllReviews();
        if (user?.id) {
            getPaymentHistory(user.id);
            getOrdersByUser(user.id);
        }
    }, [user]);

    // Calculate stats
    const stats = {
        totalVehicles: vehicles.length,
        totalOrders: orders.length,
        totalRevenue: paymentHistory.reduce((sum, payment) => sum + (payment.amount || 0), 0),
        totalReviews: reviews.length,
        avgRating: reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0,
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            if (activeTab === 'vehicles') {
                await deleteVehicle(id);
            } else if (activeTab === 'reviews') {
                await deleteReview(id);
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Vehicles"
                                value={stats.totalVehicles}
                                icon={<span className="text-2xl">🚗</span>}
                                color="blue"
                                trend={12}
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                icon={<span className="text-2xl">📦</span>}
                                color="green"
                                trend={8}
                            />
                            <StatCard
                                title="Revenue"
                                value={`$${stats.totalRevenue.toLocaleString()}`}
                                icon={<span className="text-2xl">💰</span>}
                                color="yellow"
                                trend={15}
                            />
                            <StatCard
                                title="Avg Rating"
                                value={`${stats.avgRating}/5`}
                                icon={<span className="text-2xl">⭐</span>}
                                color="purple"
                                trend={5}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SimpleTable
                                title="Recent Orders"
                                headers={['ID', 'Date', 'Status', 'Total']}
                                data={orders.slice(0, 5).map(order => ({
                                    id: order.id?.slice(0, 8) || 'N/A',
                                    date: new Date(order.createdAt).toLocaleDateString(),
                                    status: order.status,
                                    total: `$${order.totalPrice || 0}`,
                                }))}
                            />

                            <SimpleTable
                                title="Recent Reviews"
                                headers={['Rating', 'Vehicle', 'User', 'Date']}
                                data={reviews.slice(0, 5).map(review => ({
                                    rating: `${review.rating}/5`,
                                    vehicle: `${review.make} ${review.model}`,
                                    user: review.userName || 'Anonymous',
                                    date: new Date(review.createdAt).toLocaleDateString(),
                                }))}
                            />
                        </div>
                    </div>
                );

            case 'vehicles':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Add Vehicle
                            </motion.button>
                        </div>

                        <SimpleTable
                            title="All Vehicles"
                            headers={['Year', 'Make', 'Model', 'Price', 'Status']}
                            data={vehicles.map(vehicle => ({
                                id: vehicle.id,
                                year: vehicle.year,
                                make: vehicle.make,
                                model: vehicle.model,
                                price: `$${vehicle.price?.toLocaleString() || 0}`,
                                status: vehicle.status,
                            }))}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                        <SimpleTable
                            title="All Orders"
                            headers={['ID', 'Date', 'Items', 'Total', 'Status']}
                            data={orders.map(order => ({
                                id: order.id?.slice(0, 8) || 'N/A',
                                date: new Date(order.createdAt).toLocaleDateString(),
                                items: order.items?.length || 0,
                                total: `$${order.totalPrice || 0}`,
                                status: order.status,
                            }))}
                            onEdit={handleEdit}
                        />
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
                        <SimpleTable
                            title="Payment History"
                            headers={['Date', 'Amount', 'Status', 'Method']}
                            data={paymentHistory.map(payment => ({
                                id: payment.id,
                                date: new Date(payment.createdAt).toLocaleDateString(),
                                amount: `$${payment.amount?.toLocaleString() || 0}`,
                                status: payment.status,
                                method: payment.paymentMethod || 'Card',
                            }))}
                        />
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
                        <SimpleTable
                            title="All Reviews"
                            headers={['Rating', 'Vehicle', 'User', 'Comment', 'Date']}
                            data={reviews.map(review => ({
                                id: review.reviewId,
                                rating: `${review.rating}/5`,
                                vehicle: `${review.make} ${review.model}`,
                                user: review.userName || 'Anonymous',
                                comment: review.comment?.slice(0, 50) + '...',
                                date: new Date(review.createdAt).toLocaleDateString(),
                            }))}
                            onDelete={handleDelete}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex"
        >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 p-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                title={selectedItem ? 'Edit Item' : 'Add New Item'}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        {selectedItem ? 'Edit functionality' : 'Add functionality'} coming soon...
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
};

export default AdminPage;