import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./pages/Home/Home.jsx";
import SignUpPage from "./pages/Auth/Signup.jsx";
import LoginPage from "./pages/Auth/Login.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import StorePage from "./pages/Store/StorePage.jsx";
import VehiclePage from "./pages/Store/VehiclePage.jsx";
import AccessoryPage from "./pages/Store/AccessoryPage.jsx";
import CartPage from "./pages/Cart/Cart.jsx";
import {AllReviewsPage, UserReviewsPage, VehicleReviewsPage} from "./pages/Reviews/Reviews.jsx";
import PaymentHistoryPage from "./pages/Payment/PaymentHistoryPage.jsx";
import CheckoutPage from "./pages/Payment/PaymentCheckout.jsx";



import Navbar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";

import { useUserStore } from "./stores/useUserStore";
import {ToastContainer} from "react-toastify";

const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-white">
        {/* header */}
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

        {/*  footer */}
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

// auth layout for login/signup pages
const AuthLayout = ({ children }) => (
    <div className="min-h-screen justify-center">
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
                {/* Auth routes -  auth layout */}
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
            {/*  toast notifications */}
            <ToastContainer
                stacked
                autoClose={1000}
                hideProgressBar
                position="top-right"
            />

        </>
    );
}

export default App;