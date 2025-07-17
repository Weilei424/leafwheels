import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePaymentStore } from '../../stores/usePaymentStore.js';
import { useCartStore } from '../../stores/useCartStore.js';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const {
        paymentSession,
        paymentResult,
        processingPayment,
        error,
        createPaymentSession,
        processPayment,
        clearError,
        clearPaymentResult
    } = usePaymentStore();

    const { cart, total, clearCart } = useCartStore();

    const [paymentData, setPaymentData] = useState({
        paymentMethod: 'CREDIT_CARD',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        address: {
            street: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'Canada'
        }
    });

    const [step, setStep] = useState(1); // 1: Payment Form, 2: Processing, 3: Result

    // Check if cart is empty on mount
    useEffect(() => {
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        // Create payment session when component mounts
        const initializePayment = async () => {
            const userId = "0b66495d-a724-44d0-be51-fc68d79f31b1"; // Replace with actual user ID
            try {
                await createPaymentSession(userId);
            } catch (error) {
                navigate('/cart');
            }
        };

        initializePayment();

        // Clear any previous payment results
        clearPaymentResult();
        clearError();
    }, [cart.length, navigate, createPaymentSession, clearPaymentResult, clearError]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setPaymentData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setPaymentData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (error) {
            clearError();
        }
    };

    // Format card number input
    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) { // 16 digits + 3 spaces
            setPaymentData(prev => ({
                ...prev,
                cardNumber: formatted
            }));
        }
    };

    // Format expiry date input
    const formatExpiryDate = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.length <= 5) { // MM/YY
            setPaymentData(prev => ({
                ...prev,
                expiryDate: formatted
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const { cardNumber, expiryDate, cvv, cardholderName, address } = paymentData;

        if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            toast.error('Please enter a valid 16-digit card number');
            return false;
        }

        if (!expiryDate || expiryDate.length !== 5) {
            toast.error('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        if (!cvv || cvv.length < 3) {
            toast.error('Please enter a valid CVV');
            return false;
        }

        if (!cardholderName.trim()) {
            toast.error('Please enter the cardholder name');
            return false;
        }

        const requiredAddressFields = ['street', 'city', 'province', 'postalCode'];
        const missingFields = requiredAddressFields.filter(field => !address[field].trim());

        if (missingFields.length > 0) {
            toast.error('Please fill in all billing address fields');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStep(2); // Move to processing step

        // Format payment data for backend
        const formattedPaymentData = {
            paymentMethod: paymentData.paymentMethod,
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''), // Remove spaces
            expiryDate: paymentData.expiryDate,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName,
            address: `${paymentData.address.street}, ${paymentData.address.city}, ${paymentData.address.province}, ${paymentData.address.postalCode}, ${paymentData.address.country}`
        };

        try {
            const result = await processPayment(formattedPaymentData);
            setStep(3); // Move to result step
        } catch (error) {
            setStep(1); // Go back to form on error
        }
    };

    // Handle back to cart
    const handleBackToCart = () => {
        navigate('/cart');
    };

    // Handle continue shopping after successful payment
    const handleContinueShopping = () => {
        navigate('/store');
    };

    // Render payment form
    const renderPaymentForm = () => (
        <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Payment Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Card Number */}
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number *
                            </label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentData.cardNumber}
                                onChange={handleCardNumberChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date *
                                </label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={paymentData.expiryDate}
                                    onChange={handleExpiryChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                    CVV *
                                </label>
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={paymentData.cvv}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="123"
                                    maxLength="4"
                                    required
                                />
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div>
                            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name *
                            </label>
                            <input
                                type="text"
                                id="cardholderName"
                                name="cardholderName"
                                value={paymentData.cardholderName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Billing Address */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address.street"
                                        name="address.street"
                                        value={paymentData.address.street}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="123 Main Street"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="address.city"
                                            name="address.city"
                                            value={paymentData.address.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Toronto"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address.province" className="block text-sm font-medium text-gray-700 mb-2">
                                            Province *
                                        </label>
                                        <select
                                            id="address.province"
                                            name="address.province"
                                            value={paymentData.address.province}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            required
                                        >
                                            <option value="">Select Province</option>
                                            <option value="ON">Ontario</option>
                                            <option value="QC">Quebec</option>
                                            <option value="BC">British Columbia</option>
                                            <option value="AB">Alberta</option>
                                            <option value="MB">Manitoba</option>
                                            <option value="SK">Saskatchewan</option>
                                            <option value="NS">Nova Scotia</option>
                                            <option value="NB">New Brunswick</option>
                                            <option value="NL">Newfoundland and Labrador</option>
                                            <option value="PE">Prince Edward Island</option>
                                            <option value="NT">Northwest Territories</option>
                                            <option value="NU">Nunavut</option>
                                            <option value="YT">Yukon</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="address.postalCode"
                                        name="address.postalCode"
                                        value={paymentData.address.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="M5V 2T6"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processingPayment}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium text-lg transition duration-300"
                            >
                                Complete Payment - ${total.toFixed(2)}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4">
                        {cart.map((item) => {
                            const product = item.type === "VEHICLE" ? item.vehicle : item.accessory;
                            const productName = item.type === "VEHICLE"
                                ? `${product.year} ${product.make} ${product.model}`
                                : product.name;

                            return (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <div>
                                        <p className="font-medium text-gray-900">{productName}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        ${item.unitPrice.toFixed(2)}
                                    </p>
                                </div>
                            );
                        })}

                        <div className="border-t border-gray-300 pt-4">
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleBackToCart}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition duration-300"
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render processing state
    const renderProcessing = () => (
        <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
        </div>
    );

    // Render payment result
    const renderResult = () => {
        if (!paymentResult) return null;

        const isSuccess = paymentResult.status === 'APPROVED';

        return (
            <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${
                        isSuccess ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        {isSuccess ? (
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h2 className={`text-2xl font-bold mb-2 ${
                        isSuccess ? 'text-green-900' : 'text-red-900'
                    }`}>
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {isSuccess
                            ? 'Your order has been confirmed and you will receive an email confirmation shortly.'
                            : paymentResult.failureReason || 'Your payment could not be processed. Please try again.'
                        }
                    </p>

                    {isSuccess && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                            <p className="text-sm text-gray-600">Transaction ID: {paymentResult.transactionId}</p>
                            <p className="text-sm text-gray-600">Amount: ${paymentResult.amount}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleContinueShopping}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300"
                        >
                            Continue Shopping
                        </button>

                        {!isSuccess && (
                            <button
                                onClick={() => setStep(1)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition duration-300"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Checkout</h1>

                {step === 1 && renderPaymentForm()}
                {step === 2 && renderProcessing()}
                {step === 3 && renderResult()}
            </div>
        </div>
    );
};

export default CheckoutPage;