import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessoryStore } from "../../stores/useAccessoryStore.js";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";

const useAccessoryLogic = (id) => {
    const {
        currentAccessory,
        loading,
        error,
        getAccessoryById,
        clearCurrentAccessory,
        clearError,
    } = useAccessoryStore();
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        clearCurrentAccessory();
        clearError();
        if (id) getAccessoryById(id);
        return clearCurrentAccessory;
    }, [clearCurrentAccessory, clearError, getAccessoryById, id]);

    return {
        accessory: currentAccessory,
        loading,
        error,
        addingToCart,
        setAddingToCart,
    };
};

const AccessoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        accessory,
        loading,
        error,
        addingToCart,
        setAddingToCart,
    } = useAccessoryLogic(id);

    // Check if accessory is available for purchase
    const canAddToCart = accessory?.quantity > 0;
    const handleBackToStore = () => navigate("/store");

    const onAddToCartClick = async () => {
        setAddingToCart(true);
        await handleAddToCart({ product: accessory, type: "ACCESSORY" });
        setAddingToCart(false);
    };

    if (loading || error || !accessory) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center"
            >
                <div className="text-center space-y-6">
                    {loading ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto"
                            />
                            <p className="text-gray-600">Loading accessory...</p>
                        </>
                    ) : (
                        <>
                            <p className="text-red-600 text-lg">
                                Error: {error || "Accessory not found"}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Try Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBackToStore}
                                    className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Back to Store
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen mt-8 py-8 px-4 max-w-7xl mx-auto"
        >
            {/* Breadcrumb */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={handleBackToStore}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
                >
                    ← Back to Store
                </motion.button>
            </motion.nav>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm"
                >
                    <img
                        // src={accessory.imageUrls?.[0] || "/placeholder-accessory.jpg"}
                        alt={accessory.name}
                        onError={(e) => (e.target.src = "/placeholder-accessory.jpg")}
                        className="w-full max-h-[500px] object-cover rounded-xl"
                    />
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <h1 className="text-4xl font-light text-gray-900 mb-2">
                            {accessory.name}
                        </h1>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center gap-3">
            <span className={`font-medium ${
                accessory.quantity > 0 ? "text-green-600" : "text-red-500"
            }`}>
              {accessory.quantity > 0 ? `${accessory.quantity} in stock` : "Out of Stock"}
            </span>
                    </div>

                    {/* Price - use backend calculated values directly */}
                    <div className="space-y-2">
                        {accessory.onDeal ? (
                            <>
                                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-light text-gray-900">
                    ${accessory.discountPrice?.toLocaleString()}
                  </span>
                                    <span className="text-lg text-gray-400 line-through">
                    ${accessory.price?.toLocaleString()}
                  </span>
                                </div>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {/* Show discount based on type */}
                                    {accessory.discountPercentage > 0
                                        ? `${Math.round(accessory.discountPercentage * 100)}% OFF`
                                        : `$${accessory.discountAmount} OFF`
                                    }
                                </motion.span>
                            </>
                        ) : (
                            <span className="text-3xl font-light text-gray-900">
                ${accessory.price?.toLocaleString()}
              </span>
                        )}
                    </div>

                    {accessory.description && (
                        <p className="text-gray-600 leading-relaxed">
                            {accessory.description}
                        </p>
                    )}

                    <motion.button
                        whileHover={canAddToCart && !addingToCart ? { scale: 1.02 } : {}}
                        whileTap={canAddToCart && !addingToCart ? { scale: 0.98 } : {}}
                        onClick={onAddToCartClick}
                        disabled={!canAddToCart || addingToCart}
                        className={`
              w-full py-4 px-8 rounded-lg font-medium text-lg transition-all duration-200
              ${
                            canAddToCart && !addingToCart
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
            `}
                    >
                        <AnimatePresence mode="wait">
                            {addingToCart ? (
                                <motion.span
                                    key="adding"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Adding...
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {accessory.quantity === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            </div>

            {/* Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 grid md:grid-cols-3 gap-8"
            >
                <DetailsSection title="Product Details">
                    <DetailItem label="Product ID" value={accessory.id?.slice(0, 8)} />
                    <DetailItem label="Quantity Available" value={accessory.quantity} />
                    {accessory.onDeal && (
                        <>
                            <DetailItem
                                label="Original Price"
                                value={`$${accessory.price?.toLocaleString()}`}
                            />
                            <DetailItem
                                label="Sale Price"
                                value={`$${accessory.discountPrice?.toLocaleString()}`}
                            />
                            {accessory.discountPercentage > 0 ? (
                                <DetailItem
                                    label="Discount"
                                    value={`${Math.round(accessory.discountPercentage * 100)}% OFF`}
                                />
                            ) : (
                                <DetailItem
                                    label="Discount"
                                    value={`$${accessory.discountAmount} OFF`}
                                />
                            )}
                        </>
                    )}
                </DetailsSection>

                <DetailsSection title="Product Information">
                    <DetailItem
                        label="Added Date"
                        value={
                            accessory.createdAt
                                ? new Date(accessory.createdAt).toLocaleDateString()
                                : "N/A"
                        }
                    />
                    <DetailItem label="Category" value="Accessory" />
                    <DetailItem
                        label="Status"
                        value={accessory.quantity > 0 ? "Available" : "Out of Stock"}
                    />
                </DetailsSection>

                <DetailsSection title="Shipping & Returns">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        🚚 Free delivery within 2–4 business days across Canada & US.<br/>
                        🔄 30-day return policy with no restocking fee.<br/>
                        📦 Accessories are packaged securely to ensure safe arrival.<br/>
                        📞 Customer support available 24/7.
                    </p>
                </DetailsSection>
            </motion.div>

            {/* Additional Images */}
            {accessory.imageUrls && accessory.imageUrls.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16"
                >
                    <h2 className="text-2xl font-light text-gray-900 mb-6">More Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {accessory.imageUrls.slice(1).map((url, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="bg-white p-2 rounded-lg shadow-sm"
                            >
                                <img
                                    src={url}
                                    alt={`${accessory.name} ${index + 2}`}
                                    className="w-full h-32 object-cover rounded-md"
                                    onError={(e) => (e.target.src = "/placeholder-accessory.jpg")}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

const DetailsSection = ({ title, children }) => (
    <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const DetailItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 font-medium">{value}</span>
        </div>
    );
};

export default AccessoryPage;