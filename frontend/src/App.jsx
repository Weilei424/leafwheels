import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useUserStore } from "./stores/useUserStore.js";

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
import { AllReviewsPage, UserReviewsPage, VehicleReviewsPage } from "./pages/Reviews/Reviews.jsx";
import PaymentHistoryPage from "./pages/Payment/PaymentHistoryPage.jsx";
import CheckoutPage from "./pages/Payment/PaymentCheckout.jsx";

// Loading spinner
const Loading = () => <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div></div>;

// Main layout with navbar + footer
const Layout = ({ children }) => <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-1 pt-10">{children}</main><Footer /></div>;

// Auth layout (just the page, no navbar/footer)
const AuthLayout = ({ children }) => <div className="min-h-screen">{children}</div>;

// Protected route wrapper
const Protected = ({ children }) => {
    const { isAuthenticated, checkingAuth } = useUserStore();
    if (checkingAuth) return <Loading />;
    if (!isAuthenticated()) return <Navigate to="/login" />;
    return children;
};

function App() {
    const { checkingAuth, checkAuth, isAuthenticated, getUserRole } = useUserStore();
    useEffect(() => { checkAuth(); }, []);
    if (checkingAuth) return <Loading />;

    return (
        <>
            <Routes>
                <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/signup" element={isAuthenticated() ? <Navigate to="/" /> : <AuthLayout><SignUpPage /></AuthLayout>} />
                <Route path="/" element={<Protected><Layout><HomePage /></Layout></Protected>} />
                <Route path="/store" element={<Protected><Layout><StorePage /></Layout></Protected>} />
                <Route path="/vehicle/:id" element={<Protected><Layout><VehiclePage /></Layout></Protected>} />
                <Route path="/accessory/:id" element={<Protected><Layout><AccessoryPage /></Layout></Protected>} />
                <Route path="/profile" element={<Protected><Layout><UserPage /></Layout></Protected>} />
                <Route path="/reviews" element={<Protected><Layout><AllReviewsPage /></Layout></Protected>} />
                <Route path="/vehicle/:make/:model/reviews" element={<Protected><Layout><VehicleReviewsPage /></Layout></Protected>} />
                <Route path="/cart" element={<Protected><Layout><CartPage /></Layout></Protected>} />
                <Route path="/checkout" element={<Protected><Layout><CheckoutPage /></Layout></Protected>} />
                <Route path="/payment-history" element={<Protected><Layout><PaymentHistoryPage /></Layout></Protected>} />
                <Route path="/my-reviews" element={<Protected><Layout><UserReviewsPage /></Layout></Protected>} />
                <Route path="/admin" element={<Protected>{getUserRole() === 'ADMIN' ? <Layout><AdminPage /></Layout> : <Navigate to="/" />}</Protected>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={1000} stacked hideProgressBar />
        </>
    );
}

export default App;
