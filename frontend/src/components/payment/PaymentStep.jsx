import React from "react";
import { motion } from "framer-motion";

const PaymentStep = ({ paymentData, onInputChange, onSubmit, error }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>

    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={(e) => onInputChange("cardNumber", e.target.value)}
          className="col-span-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
        <input
          type="text"
          placeholder="MM/YY"
          value={paymentData.expiryDate}
          onChange={(e) => onInputChange("expiryDate", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
        <input
          type="text"
          placeholder="CVV"
          value={paymentData.cvv}
          onChange={(e) => onInputChange("cvv", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Name on Card"
        value={paymentData.nameOnCard}
        onChange={(e) => onInputChange("nameOnCard", e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        required
      />

      <input
        type="text"
        placeholder="Billing Address"
        value={paymentData.billingAddress}
        onChange={(e) => onInputChange("billingAddress", e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={paymentData.city}
          onChange={(e) => onInputChange("city", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={paymentData.postalCode}
          onChange={(e) => onInputChange("postalCode", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors"
      >
        Complete Payment
      </motion.button>
    </form>
  </motion.div>
);

export default PaymentStep;
