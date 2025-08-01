export const EmptyCheckoutState = ({ user, navigate }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {!user ? "Please log in to continue" : "Your cart is empty"}
            </h2>
            <button
                onClick={() => navigate(!user ? "/login" : "/store")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
                {!user ? "Go to Login" : "Continue Shopping"}
            </button>
        </div>
    </div>
);