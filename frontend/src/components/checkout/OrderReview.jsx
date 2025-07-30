import {motion, AnimatePresence } from "framer-motion";
import CartItem from "../cart/CartItem.jsx";


export const OrderReview = ({ transformedCart }) => (
    <div className="lg:col-span-2 mb-8 lg:mb-0">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-medium text-gray-900">
                Review Your Order
            </h2>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {transformedCart.map((item) => (
                        <CartItem
                            key={item._id}
                            item={item}
                            isCheckout={true}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    </div>
);