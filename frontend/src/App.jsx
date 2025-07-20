import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, Bounce } from 'react-toastify';

import HomePage from "./pages/Home/Home.jsx";
import SignUpPage from "./pages/Auth/Signup.jsx";
import LoginPage from "./pages/Auth/Login.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import StorePage from "./pages/Store/StorePage.jsx";
import VehiclePage from "./pages/Store/VehiclePage.jsx";
import AccessoryPage from "./pages/Store/AccessoryPage.jsx";
import CartPage from "./pages/Cart/Cart.jsx";
import { CheckoutPage, PaymentHistoryPage } from "./pages/Payment/PaymentPages.jsx";
import {AllReviewsPage, UserReviewsPage, VehicleReviewsPage} from "./pages/Reviews/Reviews.jsx";


import Navbar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";

import { useUserStore } from "./stores/useUserStore";

// Clean Layout component with consistent styling
const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-white">
        {/* Clean header */}
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
        >
            <Navbar />
        </motion.header>

        {/* Main content with consistent background */}
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-grow mt-10"
        >
            <AnimatePresence mode="wait">
                {children}
            </AnimatePresence>
        </motion.main>

        {/* Clean footer */}
        <motion.footer
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className=" border-t border-gray-100"
        >
            <Footer />
        </motion.footer>
    </div>
);

// Clean auth layout for login/signup pages
const AuthLayout = ({ children }) => (
    <div className="min-h-screen   justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    </div>
);

// Page transition wrapper
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

function App() {
    const { user } = useUserStore();

    return (
        <>
            <Routes>
                {/* Auth routes - clean auth layout */}
                <Route
                    path="/login"
                    element={
                        !user ? (
                            <AuthLayout>
                                <PageWrapper>
                                    <LoginPage />
                                </PageWrapper>
                            </AuthLayout>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        !user ? (
                            <AuthLayout>
                                <PageWrapper>
                                    <SignUpPage />
                                </PageWrapper>
                            </AuthLayout>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                {/* Main app routes - with layout */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <PageWrapper>
                                <HomePage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/store"
                    element={
                        <Layout>
                            <PageWrapper>
                                <StorePage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <Layout>
                            <PageWrapper>
                                <CartPage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/vehicle/:id"
                    element={
                        <Layout>
                            <PageWrapper>
                                <VehiclePage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/accessory/:id"
                    element={
                        <Layout>
                            <PageWrapper>
                                <AccessoryPage />
                            </PageWrapper>
                        </Layout>
                    }
                />

                {/* Payment routes */}
                <Route
                    path="/checkout"
                    element={
                        <Layout>
                            <PageWrapper>
                                <CheckoutPage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/payment-history"
                    element={
                        <Layout>
                            <PageWrapper>
                                <PaymentHistoryPage />
                            </PageWrapper>
                        </Layout>
                    }
                />

                <Route
                    path="/vehicle/:make/:model/reviews"
                    element={
                        <Layout>
                            <PageWrapper>
                                <VehicleReviewsPage />
                            </PageWrapper>
                        </Layout>
                    }
                />
                <Route
                    path="/my-reviews"
                    element={
                        <Layout>
                            <PageWrapper>
                                <UserReviewsPage />
                            </PageWrapper>
                        </Layout>
                    }
                />

                <Route
                    path="/reviews"
                    element={
                        <Layout>
                            <PageWrapper>
                                <AllReviewsPage />
                            </PageWrapper>
                        </Layout>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <Layout>
                            <PageWrapper>
                                <AdminPage />
                            </PageWrapper>
                        </Layout>
                    }
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Clean toast notifications matching our design */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-100 !rounded-lg"
                progressClassName="!bg-green-600"
                closeButton={({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
                style={{
                    fontSize: '14px',
                    fontWeight: '500',
                }}
            />
        </>
    );
}

export default App;