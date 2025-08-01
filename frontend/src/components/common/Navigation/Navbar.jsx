import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../../stores/useCartStore.js";
import { useUserStore } from "../../../stores/useUserStore.js";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = useCartStore();
    const { user, logout } = useUserStore();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const cartItemCount = cart.length;

    // Handle logout with redirect
    const handleLogout = async () => {
        try {
            await logout();
            // Redirect to homepage after successful logout
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails, still redirect for UX
            navigate('/', { replace: true });
        }
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Store", path: "/store" },

    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
                    : "bg-white"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="LeafWheels Logo"
                                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain"
                            />
                            <h1 className="text-2xl font-bold text-gray-900">LeafWheels</h1>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink key={link.path} to={link.path} isActive={location.pathname === link.path}>
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <CartButton count={cartItemCount} />
                        <UserMenu user={user} onLogout={handleLogout} />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <CartButton count={cartItemCount} />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <MenuIcon isOpen={isMenuOpen} />
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
                        >
                            <div className="py-4 space-y-1">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className={`block px-4 py-3 text-base text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg mx-2 ${
                                                location.pathname === link.path ? "text-green-600 bg-green-50" : ""
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile User Actions */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.1 }}
                                    className="pt-4 border-t border-gray-100 mx-4"
                                >
                                    {user ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500 px-4">Signed in as {user.firstName}</p>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-4"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

// Navigation Link Component
const NavLink = ({ to, children, isActive }) => (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
        <Link
            to={to}
            className={`text-base font-medium transition-colors duration-200 relative ${
                isActive
                    ? "text-green-600"
                    : "text-gray-700 hover:text-green-600"
            }`}
        >
            {children}
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full"
                />
            )}
        </Link>
    </motion.div>
);

// Cart Button Component
const CartButton = ({ count }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-2 -right-1 bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
                    >
                        {count > 99 ? "99+" : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    </motion.div>
);

// User Menu Component
const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                        onBlur={() => setIsOpen(false)}
                    >
                        {user ? (
                            <>
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/order-history"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/payment-history"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Payments
                                </Link>
                                <Link
                                    to="/my-reviews"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Reviews
                                </Link>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Animated Menu Icon
const MenuIcon = ({ isOpen }) => (
    <div className="w-7 h-7 flex flex-col justify-center space-y-1">
        <motion.span
            animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-7 bg-current"
        />
        <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-7 bg-current"
        />
        <motion.span
            animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-7 bg-current"
        />
    </div>
);

export default Navbar;