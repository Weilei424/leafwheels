import { useState } from "react";
import { Link } from "react-router-dom";
import {useUserStore} from "../../stores/useUserStore.js";
import {motion} from "framer-motion";


const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signup, loading } = useUserStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = formData;
        signup(firstName, lastName, email, password, confirmPassword);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br   flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <img
                            src="/logo.png"
                            alt="LeafWheels Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h1 className="text-2xl font-light text-gray-900">LeafWheels</h1>
                    </div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">Create account</h2>
                    <p className="text-gray-600">Join us today and start your journey</p>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80  rounded-2xl shadow-lg border border-white/20 p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First name
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last name
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm password
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Terms */}
                        <div className="text-xs text-gray-500 text-center">
                            By creating an account, you agree to our{" "}
                            <Link to="/terms" className="text-green-600 hover:text-green-700">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-green-600 hover:text-green-700">
                                Privacy Policy
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                  <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Creating account...
                </span>
                            ) : (
                                "Create account"
                            )}
                        </motion.button>
                    </form>

                    {/* Sign in link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-green-600 hover:text-green-700 font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-xs text-gray-500"
                >
                    <p>© 2024 LeafWheels. All rights reserved.</p>
                </motion.div>
            </motion.div>
        </div>
    );
};
export default SignUpPage;