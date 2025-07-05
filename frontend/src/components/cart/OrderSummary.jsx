import { Link } from "react-router-dom";

const OrderSummary = ({ cart = [] }) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = 0; // Placeholder
    const shipping = 0; // Placeholder
    const tax = subtotal * 0.13;
    const total = subtotal - savings + shipping + tax;

    return (
        <div className="space-y-4 rounded-md border p-4 bg-white text-gray-800">
            <p className="text-lg font-semibold">Order Summary</p>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Original Price</span>
                    <span>${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Savings</span>
                    <span className="text-green-600">-${savings.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Store Pickup</span>
                    <span>$0</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                </div>
            </div>

            <button
                className="w-full rounded-md bg-green-600 text-white py-2 text-sm"
                // onClick={handlePayment}
            >
                Proceed to Checkout
            </button>

            <div className="text-center text-sm">
                <span>or </span>
                <Link to="/" className="text-blue-600 underline">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSummary;
