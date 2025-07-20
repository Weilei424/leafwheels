import React from "react";
import { motion } from "framer-motion";

const ProcessingStep = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-12"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-6"
    />
    <h2 className="text-lg font-medium text-gray-900 mb-2">
      Processing Payment
    </h2>
    <p className="text-gray-600">
      Please wait while we process your payment...
    </p>
  </motion.div>
);

export default ProcessingStep;
