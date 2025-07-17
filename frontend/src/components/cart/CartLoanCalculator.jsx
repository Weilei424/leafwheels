import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLoanCalculatorStore } from '../../stores/useLoanCalculator.js';
import { useCartStore } from '../../stores/useCartStore.js';

const CartLoanCalculator = () => {
    const { total: cartTotal } = useCartStore();
    const { calculationResults, loading, error, calculateLoan, clearError } = useLoanCalculatorStore();

    const [formData, setFormData] = useState({
        downPayment: '',
        interestRate: '5.99',
        loanTermMonths: '60',
        tradeInValue: ''
    });

    const [isExpanded, setIsExpanded] = useState(false);

    // Helper functions for better readability
    const isCartEmpty = () => cartTotal <= 0;
    const hasCalculationResults = () => calculationResults !== null;
    const getSuggestedDownPayment = () => (cartTotal * 0.2).toFixed(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (error) {
            clearError();
        }
    };

    const validateForm = () => {
        if (isCartEmpty()) {
            toast.error('Add items to cart first');
            return false;
        }

        if (!formData.downPayment || !formData.interestRate || !formData.loanTermMonths) {
            toast.error('Please fill in all required fields');
            return false;
        }

        return true;
    };

    const buildLoanData = () => {
        return {
            vehiclePrice: cartTotal,
            downPayment: parseFloat(formData.downPayment),
            interestRate: parseFloat(formData.interestRate),
            loanTermMonths: parseInt(formData.loanTermMonths),
            tradeInValue: formData.tradeInValue ? parseFloat(formData.tradeInValue) : 0,
            taxRate: 0 // Tax already included in cart total
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const loanData = buildLoanData();

        try {
            await calculateLoan(loanData);
            setIsExpanded(true);
        } catch (error) {
            // Error handled in store
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Render empty cart state
    const renderEmptyCartState = () => (
        <div className="text-center py-6">
            <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 3H1m6 10a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
            </div>
            <p className="text-sm text-gray-500">Add items to your cart to see financing options</p>
        </div>
    );

    // Render cart total section
    const renderCartTotal = () => (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total to Finance:</span>
                <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
            </div>
        </div>
    );

    // Render quick payment preview
    const renderPaymentPreview = () => {
        if (isExpanded || !hasCalculationResults()) {
            return null;
        }

        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-700">Monthly Payment:</span>
                    <span className="text-xl font-bold text-green-600">
                        ${calculationResults.monthlyPayment.toFixed(2)}
                    </span>
                </div>
                <p className="text-xs text-green-600">
                    {formData.loanTermMonths} months at {formData.interestRate}% APR
                </p>
            </div>
        );
    };

    // Render form inputs
    const renderFormInputs = () => (
        <div className="space-y-4">
            {/* Down Payment */}
            <div>
                <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment *
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                        type="number"
                        id="downPayment"
                        name="downPayment"
                        value={formData.downPayment}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        placeholder={getSuggestedDownPayment()}
                        required
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Suggested: ${getSuggestedDownPayment()} (20%)</p>
            </div>

            {/* Interest Rate */}
            <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%) *
                </label>
                <div className="relative">
                    <input
                        type="number"
                        step="0.01"
                        id="interestRate"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleInputChange}
                        className="w-full pr-8 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
            </div>

            {/* Loan Term */}
            <div>
                <label htmlFor="loanTermMonths" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term *
                </label>
                <select
                    id="loanTermMonths"
                    name="loanTermMonths"
                    value={formData.loanTermMonths}
                    onChange={handleInputChange}
                    className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    required
                >
                    <option value="36">3 years (36 months)</option>
                    <option value="48">4 years (48 months)</option>
                    <option value="60">5 years (60 months)</option>
                    <option value="72">6 years (72 months)</option>
                    <option value="84">7 years (84 months)</option>
                </select>
            </div>

            {/* Trade-in Value */}
            <div>
                <label htmlFor="tradeInValue" className="block text-sm font-medium text-gray-700 mb-2">
                    Trade-in Value (Optional)
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                        type="number"
                        id="tradeInValue"
                        name="tradeInValue"
                        value={formData.tradeInValue}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        placeholder="0"
                    />
                </div>
            </div>
        </div>
    );

    // Render calculate button
    const renderCalculateButton = () => (
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                </>
            ) : (
                'Calculate Payment'
            )}
        </button>
    );

    // Render error message
    const renderError = () => {
        if (!error) {
            return null;
        }

        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        );
    };

    // Render calculation results
    const renderResults = () => {
        if (!isExpanded || !hasCalculationResults()) {
            return null;
        }

        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-4 text-lg">Loan Summary</h4>

                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-green-700">Monthly Payment:</span>
                        <span className="text-xl font-bold text-green-600">
                            ${calculationResults.monthlyPayment.toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t border-green-200 pt-3 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-green-700">Loan Amount:</span>
                            <span className="font-medium text-green-600">
                                ${calculationResults.loanAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-green-700">Total Payment:</span>
                            <span className="font-medium text-green-600">
                                ${calculationResults.totalPayment.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-600">
                        *Estimated payments. Final terms may vary based on credit approval.
                    </p>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Financing Options</h3>
                {!isCartEmpty() && (
                    <button
                        type="button"
                        onClick={toggleExpanded}
                        className="text-green-600 hover:text-green-700 text-sm font-medium transition duration-200"
                    >
                        {isExpanded ? 'Hide Calculator' : 'Calculate Payment'}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="space-y-4">
                {isCartEmpty() && renderEmptyCartState()}

                {!isCartEmpty() && (
                    <>
                        {renderCartTotal()}
                        {renderPaymentPreview()}

                        {isExpanded && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {renderFormInputs()}
                                {renderCalculateButton()}
                            </form>
                        )}

                        {renderError()}
                        {renderResults()}
                    </>
                )}
            </div>
        </div>
    );
};

export default CartLoanCalculator;