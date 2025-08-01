import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/useUserStore';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, loading, logout } = useUserStore(); // ✅ Only use what exists in simplified store

    // Redirect if not authenticated
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen py-12 px-4 max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-500">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Avatar Section */}
                <div className="px-8 py-12 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-medium text-green-600">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-600 capitalize">{user?.role?.toLowerCase()}</span> {/* ✅ Direct role access */}
                    </div>
                </div>

                {/* Profile Information */}
                <div className="p-8">
                    <div className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                    {user?.firstName}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                    {user?.lastName}
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                {user?.email}
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Role
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                                    {user?.role?.toLowerCase()}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Status
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                    <span className="inline-flex items-center gap-2 text-green-600">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/settings')} // ✅ Navigate to settings instead of reset password
                            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Account Settings
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Signing Out...' : 'Sign Out'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;