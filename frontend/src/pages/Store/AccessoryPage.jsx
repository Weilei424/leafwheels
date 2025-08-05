import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const {
        accessory,
        loading,
        error,
        addingToCart,
        setAddingToCart,
    } = useAccessoryLogic(id);

    // Image handling logic
    const imageUrls = accessory?.imageUrls || [];
    const hasMultipleImages = imageUrls.length > 1;

    const nextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
            setImageLoading(true);
        }
    };

    const prevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
            setImageLoading(true);
        }
    };

    // Check if accessory is available for purchase
    const canAddToCart = accessory?.quantity > 0 && quantity <= accessory?.quantity;
    const handleBackToStore = () => navigate("/store");

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Math.min(Number(e.target.value), accessory?.quantity || 1));
        setQuantity(value);
    };

    const onAddToCartClick = async () => {
        setAddingToCart(true);
        await handleAddToCart({ product: accessory, type: "ACCESSORY", quantity });
        setAddingToCart(false);
    };

    // Reset quantity and image index when accessory changes
    useEffect(() => {
        setQuantity(1);
        setCurrentImageIndex(0);
        setImageLoading(true);
    }, [accessory?.id]);

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
                {/* Image Carousel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden"
                >
                    {/* Loading overlay */}
                    {imageLoading && (
                        <div className="absolute inset-6 bg-gray-100 flex items-center justify-center rounded-xl z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full"
                            />
                        </div>
                    )}

                    {/* Main image */}
                    <div className="relative group">
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`${accessory.name} - Image ${currentImageIndex + 1}`}
                            onLoad={() => setImageLoading(false)}
                            className="w-full max-h-[500px] object-cover rounded-xl transition-opacity duration-300"
                            style={{ opacity: imageLoading ? 0.3 : 1 }}
                        />

                        {/* Navigation arrows - only show if multiple images */}
                        {hasMultipleImages && !imageLoading && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
                                    aria-label="Next image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Image counter */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {imageUrls.length}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip - only show if multiple images */}
                    {hasMultipleImages && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {imageUrls.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setImageLoading(true);
                                    }}
                                    className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                                        index === currentImageIndex
                                            ? 'border-green-500 ring-2 ring-green-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
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

                    {/* Quantity Selector */}
                    {accessory.quantity > 0 && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={accessory.quantity}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="w-20 px-3 py-2 text-center border-0 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(accessory.quantity, quantity + 1))}
                                        disabled={quantity >= accessory.quantity}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Max: {accessory.quantity}
                                </span>
                            </div>
                        </div>
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
                                    Adding {quantity} to cart...
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
                                        : `Add ${quantity} to Cart`}
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