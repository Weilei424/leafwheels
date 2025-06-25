import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const cartItemCount = 3;

    useEffect(() => {
        function scrollHandler() {
            if (window.scrollY >= 100) {
                setIsFixed(true);
            } else if (window.scrollY <= 50) {
                setIsFixed(false);
            }
        }
        window.addEventListener("scroll", scrollHandler);
        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    // Reusable Cart Icon Component
    const CartIcon = () => (
        <Link to="/cart" className="relative">
            <svg className="w-7 h-7" fill="black" viewBox="0 0 24 24">
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
            </svg>
            {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                </span>
            )}
        </Link>
    );

    const UserIcon = () => (
        <svg className="w-7 h-7" fill="black" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
    );

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-15">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="LeafWheels Logo"
                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
                        />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">LeafWheels</h1>
                    </Link>

                    {/* Mobile: Icons + Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <div className="flex items-center gap-1">
                            <UserIcon />
                            <CartIcon />
                        </div>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                <span className={`block h-0.5 w-6 bg-black transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block h-0.5 w-6 bg-black transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block h-0.5 w-6 bg-black transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>

                    {/* Desktop: Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-lg font-semibold hover:text-blue-600 transition-colors">Home</Link>
                        <Link to="/store" className="text-lg font-semibold hover:text-blue-600 transition-colors">Store</Link>
                        <Link to="/cart" className="text-lg font-semibold hover:text-blue-600 transition-colors">Cart</Link>
                        <div className="flex items-center gap-2 ml-4">
                            <UserIcon />
                            <CartIcon />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="py-4 space-y-2">
                            <Link to="/" className="block px-4 py-2 text-lg font-semibold transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link to="/store" className="block px-4 py-2 text-lg font-semibold transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Store
                            </Link>
                            <Link to="/cart" className="block px-4 py-2 text-lg font-semibold transition-colors" onClick={() => setIsMenuOpen(false)}>
                                Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;