import {motion} from "framer-motion";
export const OrderSummary = ({ transformedCart, total }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
        </h2>

        <div className="space-y-3">
            {transformedCart.map((item, index) => (
                <OrderSummaryItem
                    key={item._id}
                    item={item}
                    index={index}
                />
            ))}

            <OrderTotal total={total} />
        </div>
    </motion.div>
);

const OrderSummaryItem = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
    >
        <ItemDetails item={item} />
        <ItemPricing item={item} />
    </motion.div>
);

const ItemDetails = ({ item }) => (
    <div>
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
        {item.onDeal && item.discountPercentage > 0 && (
            <p className="text-xs text-red-600 font-medium">
                {Math.round(item.discountPercentage * 100)}% OFF
            </p>
        )}
    </div>
);

export const ItemPricing = ({ item }) => {
    const hasDiscount = item.onDeal && item.discountPercentage > 0 && item.discountPrice < item.price;

    return (
        <div className="text-right">
            {hasDiscount ? (
                <>
                    <p className="font-semibold text-green-600">
                        ${(item.discountPrice * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                        ${(item.price * item.quantity).toLocaleString()}
                    </p>
                </>
            ) : (
                <p className="font-semibold">
                    ${(item.discountPrice * item.quantity).toLocaleString()}
                </p>
            )}
        </div>
    );
};

const OrderTotal = ({ total }) => (
    <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
        </div>
    </div>
);