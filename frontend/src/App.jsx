import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/common/Navigation/Navbar.jsx";
import Footer from "./components/common/Footer/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home.jsx"; // Direct import

function App() {
    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Add other paths here */}
                {/*    <Route path="/" element={<Home />} />*/}
                {/*    <Route path="/Products" element={<Shop />} />*/}
                {/*    <Route path="/Products/:id" element={<Product />} />*/}
                {/*    <Route path="/cart" element={<Cart />} />*/}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;