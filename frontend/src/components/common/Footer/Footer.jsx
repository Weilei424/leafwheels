import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                                <img src="../../../../public/logo.png" alt="LeafWheels Logo" />

                            </div>
                            <h2 className="text-xl font-light text-gray-900">LeafWheels</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Your trusted partner for premium electric and hybrid vehicles.
                            Driving towards a sustainable future, one wheel at a time.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {[
                                { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", label: "Twitter" },
                                { icon: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z", label: "Facebook" },
                                { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.120.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z", label: "Instagram" }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-200"
                                    aria-label={social.label}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Browse Vehicles", href: "/store" },
                                { name: "Electric Cars", href: "/store?category=electric" },
                                { name: "Hybrid Vehicles", href: "/store?category=hybrid" },
                                { name: "Test Drive", href: "/test-drive" },
                                { name: "Financing", href: "/financing" },
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Help Center", href: "/help" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Warranty", href: "/warranty" },
                                { name: "Service Centers", href: "/service" },
                                { name: "Returns Policy", href: "/returns" },
                                { name: "Reviews", href: "/reviews" },
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600">123 Green Street</p>
                                    <p className="text-sm text-gray-600">Toronto, ON M5V 3A8</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                                <p className="text-sm text-gray-600">(416) 123-4567</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                                <p className="text-sm text-gray-600">contact@leafwheels.com</p>
                            </div>


                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 pt-8 border-t border-gray-100"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                            <p className="text-sm text-gray-500">
                                © {currentYear} LeafWheels. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
                                <Link to="/privacy" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                                    Terms of Service
                                </Link>
                                <Link to="/accessibility" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                                    Accessibility
                                </Link>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;