import {motion} from "framer-motion";

export const CheckoutHeader = () => (
    <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
    >
        Checkout
    </motion.h1>
);