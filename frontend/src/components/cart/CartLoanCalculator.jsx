import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLoanCalculatorStore } from "../../stores/useLoanCalculatorStore.js";
import { useCartStore } from '../../stores/useCartStore.js';
import {motion, AnimatePresence} from "framer-motion";



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

    const toNumber = (value) => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(num) ? 0 : num;
    };

    const validateForm = () => {
        if (cartTotal <= 0) {
            toast.error('Add items to cart first');
            return false;
        }
        if (!formData.downPayment || !formData.interestRate || !formData.loanTermMonths) {
            toast.error('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const loanData = {
            vehiclePrice: cartTotal,
            downPayment: parseFloat(formData.downPayment),
            interestRate: parseFloat(formData.interestRate),
            loanTermMonths: parseInt(formData.loanTermMonths),
            tradeInValue: formData.tradeInValue ? parseFloat(formData.tradeInValue) : 0,
            taxRate: 0
        };

        try {
            await calculateLoan(loanData);
            setIsExpanded(true);
        } catch (error) {
            // Error handled by store
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Financing Options</h3>
                {cartTotal > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        {isExpanded ? 'Hide' : 'Calculate'}
                    </motion.button>
                )}
            </div>

            {cartTotal <= 0 ? (
                <p className="text-sm text-gray-500">Add items to your cart to see financing options</p>
            ) : (
                <>
                    {/* Cart Total */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Cart Total:</span>
                            <span className="text-lg font-semibold text-gray-900">
                ${cartTotal.toFixed(2)}
              </span>
                        </div>
                    </div>

                    {/* Quick Preview */}
                    {!isExpanded && calculationResults && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Estimated Monthly Payment:</span>
                                <span className="text-lg font-semibold">
                  ${toNumber(calculationResults.monthlyPayment).toFixed(2)}
                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Based on {formData.loanTermMonths} months at {formData.interestRate}% APR
                            </p>
                        </motion.div>
                    )}

                    {/* Expanded Form */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-4 overflow-hidden"
                            >
                                {/* Down Payment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Down Payment *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            name="downPayment"
                                            value={formData.downPayment}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            placeholder={cartTotal.toFixed(2)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Interest Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Interest Rate (%) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleInputChange}
                                            className="w-full pr-8 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                    </div>
                                </div>

                                {/* Loan Term */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loan Term *
                                    </label>
                                    <select
                                        name="loanTermMonths"
                                        value={formData.loanTermMonths}
                                        onChange={handleInputChange}
                                        className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trade-in Value (Optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            name="tradeInValue"
                                            value={formData.tradeInValue}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium transition-colors"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                      <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Calculating...
                    </span>
                                    ) : (
                                        'Calculate Payment'
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-50 border border-red-200 rounded-lg p-3"
                            >
                                <p className="text-red-600 text-sm">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results */}
                    <AnimatePresence>
                        {isExpanded && calculationResults && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="border border-gray-200 rounded-lg p-4 bg-green-50"
                            >
                                <h4 className="font-medium text-gray-900 mb-3">Loan Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Monthly Payment:</span>
                                        <span className="font-semibold text-gray-900">
                      ${toNumber(calculationResults.monthlyPayment).toFixed(2)}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Loan Amount:</span>
                                        <span className="font-medium text-gray-900">
                      ${toNumber(calculationResults.loanAmount).toFixed(2)}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Payment:</span>
                                        <span className="font-medium text-gray-900">
                      ${toNumber(calculationResults.totalPayment).toFixed(2)}
                    </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );
};
export default CartLoanCalculator;