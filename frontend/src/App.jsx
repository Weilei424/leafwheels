import {Navigate, Route, Routes} from "react-router-dom";

import HomePage from "./pages/Home/Home.jsx";
import SignUpPage from "./pages/Auth/Signup.jsx";
import LoginPage from "./pages/Auth/Login.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
// import CategoryPage from "./pages/CategoryPage";

import StorePage from "./pages/Store/StorePage.jsx";
import Navbar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";
import CartPage from "./pages/Cart/Cart.jsx"

import VehiclePage from "./pages/Store/VehiclePage.jsx";
import AccessoryPage from "./pages/Store/AccessoryPage.jsx";
import { ToastContainer, Bounce } from 'react-toastify';

// import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
// import PurchaseCancelPage from "./pages/PurchaseCancelPage";

import {useUserStore} from "./stores/useUserStore";
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
    const {user} = useUserStore();


    // useEffect(() => {
    //     if (!user) return;
    //
    //     getCartItems();
    // }, [getCartItems, user]);


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
        <>
            <Routes>
                {/* Auth routes - no layout */}
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/' />} />
                <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/' />} />


                {/* Store routes - with layout */}
                <Route path="/" element={<Layout> <HomePage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/store" element={<Layout><StorePage/></Layout>} />
                <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
                <Route path="/vehicle/:id" element={<Layout> <VehiclePage /></Layout>} />
                <Route path="/accessory/:id" element={<Layout><AccessoryPage /></Layout>} />
                {/*<Route path="/accessory/:id" element={<Layout><AccessoryPage /></Layout>} />*/}


                {/* <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} /> */}
                {/* <Route path="/purchase-success" element={<Layout><PurchaseSuccessPage /></Layout>} /> */}
                {/* <Route path="/purchase-cancel" element={<Layout><PurchaseCancelPage /></Layout>} /> */}
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />


        </>

    );
}

export default App;
