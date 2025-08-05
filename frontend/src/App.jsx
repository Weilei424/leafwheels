import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Components
import Navbar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";

// Pages
import HomePage from "./pages/Home/Home.jsx";
import SignUpPage from "./pages/Auth/Signup.jsx";
import LoginPage from "./pages/Auth/Login.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import StorePage from "./pages/Store/StorePage.jsx";
import VehiclePage from "./pages/Store/VehiclePage.jsx";
import AccessoryPage from "./pages/Store/AccessoryPage.jsx";
import CartPage from "./pages/Cart/Cart.jsx";
import UserPage from "./pages/User/User.jsx";
import PaymentHistoryPage from "./pages/Payment/PaymentHistoryPage.jsx";
import CheckoutPage from "./pages/Payment/PaymentCheckout.jsx";
import OrderHistoryPage from "./pages/Order/OrderHistoryPage.jsx";
import OrderDetailsPage from "./pages/Order/OrderDetailsPage.jsx";
import AllReviewsPage from "./pages/Reviews/AllReviewsPage.jsx";
import VehicleReviewsPage from "./pages/Reviews/VehicleReviewsPage.jsx";
import UserReviewsPage from "./pages/Reviews/UserReviewsPage.jsx";

// Layout wrappers
const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className=" lex-grow pt-10">{children}</main>
        <Footer />
    </div>
);

const AuthLayout = ({ children }) => (
    <div>
        {children}
    </div>
);

// Main application
function App() {
    return (
        <>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />

                {/* Public Routes */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/store" element={<Layout><StorePage /></Layout>} />
                <Route path="/vehicle/:id" element={<Layout><VehiclePage /></Layout>} />
                <Route path="/accessory/:id" element={<Layout><AccessoryPage /></Layout>} />

                {/* User Routes */}
                <Route path="/profile" element={<Layout><UserPage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
                <Route path="/order-history" element={<Layout><OrderHistoryPage /></Layout>} />
                <Route path="/orders/:orderId" element={<Layout><OrderDetailsPage /></Layout>} />
                <Route path="/payment-history" element={<Layout><PaymentHistoryPage /></Layout>} />
                <Route path="/my-reviews" element={<Layout><UserReviewsPage /></Layout>} />

                {/* Reviews */}
                <Route path="/reviews" element={<Layout><AllReviewsPage /></Layout>} />
                <Route path="/vehicle/:make/:model/reviews" element={<Layout><VehicleReviewsPage /></Layout>} />

                {/* Admin */}
                <Route path="/admin" element={<Layout><AdminPage /></Layout>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={200}
                hideProgressBar
                stacked
            />
        </>
    );
}

export default App;
