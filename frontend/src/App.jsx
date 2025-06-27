import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home/Home.jsx";
import SignUpPage from "./pages/Auth/Signup.jsx";
import LoginPage from "./pages/Auth/Login.jsx";
// import AdminPage from "./pages/AdminPage";
// import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/Cart/Cart.jsx";

import Navbar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";


// import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
// import LoadingSpinner from "./components/LoadingSpinner";
import Cart from "./pages/Cart/Cart.jsx";
// import { useCartStore } from "./stores/useCartStore";
// import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
// import PurchaseCancelPage from "./pages/PurchaseCancelPage";

// Layout component for pages with navbar/footer
const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <div className="absolute inset-0 -z-10">
            <div className="w-full h-full" />
        </div>
        <header>
            <Navbar />
        </header>
        <main className="flex-grow bg-gray-50 p-4">
            {children}
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
);



function App() {
    // const { user, checkAuth, checkingAuth } = useUserStore();
    // const { getCartItems } = useCartStore();

    // useEffect(() => {
    //     checkAuth();
    // }, [checkAuth]);

    // useEffect(() => {
    //     if (user) getCartItems();
    // }, [user, getCartItems]);

    // if (checkingAuth) return <LoadingSpinner />;

    return (
        <Routes>
            {/* Auth routes - no layout */}
            <Route path="/login" element={<LoginPage />} />
             <Route path="/signup" element={<SignUpPage />} />

            {/* Store routes - with layout */}
            <Route path="/" element={<Layout> <HomePage /></Layout>} />


            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            {/* <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} /> */}
            {/* <Route path="/secret-dashboard" element={<Layout><AdminPage /></Layout>} /> */}
            {/* <Route path="/purchase-success" element={<Layout><PurchaseSuccessPage /></Layout>} /> */}
            {/* <Route path="/purchase-cancel" element={<Layout><PurchaseCancelPage /></Layout>} /> */}

            {/* Notifications */}
            {/* <Toaster position="top-right" reverseOrder={false} /> */}
        </Routes>
    );
}

export default App;
