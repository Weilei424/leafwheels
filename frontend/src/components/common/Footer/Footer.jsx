import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">

                    {/* Logo & Description */}
                    <div className="footer-box">
                        <div className="footer-logo">
                            <svg className="footer-logo-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
                            </svg>
                            <h1 className="footer-logo-text">LeafWheels</h1>
                        </div>
                        <p className="footer-description">
                            This is a Vehicle Store
                        </p>
                    </div>

                    {/* About Us */}
                    <div className="footer-box">
                        <h2 className="footer-heading">About Us</h2>
                        <ul className="footer-list">
                            <li className="footer-list-item">Careers</li>
                            <li className="footer-list-item">Our Stores</li>
                            <li className="footer-list-item">Our Cares</li>
                            <li className="footer-list-item">Terms & Conditions</li>
                            <li className="footer-list-item">Privacy Policy</li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="footer-box">
                        <h2 className="footer-heading">Customer Care</h2>
                        <ul className="footer-list">
                            <li className="footer-list-item">We are here to help you.</li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="footer-box">
                        <h2 className="footer-heading">Contact Us</h2>
                        <ul className="footer-list">
                            <li className="footer-list-item">123 Leaf Street</li>
                            <li className="footer-list-item">Email: contact@leafwheels.com</li>
                            <li className="footer-list-item">Phone: 123-456-78910</li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
