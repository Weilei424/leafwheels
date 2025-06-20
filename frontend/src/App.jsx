import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestPage from "./pages/TestPage.jsx";  // Changed from "pages/TestPage.jsx"
import HomePage from "./pages/HomePage.jsx";   // Changed from "pages/HomePage.jsx"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Test" element={<TestPage />} />
            </Routes>
        </Router>
    );
}

export default App;