import { useState } from "react";

const tabs = [
    { id: "create", label: "Create Product" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
];

const dummyProducts = [
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
];

const dummyOrders = [
    { id: 1, product: "Product 1", status: "Pending" },
    { id: 2, product: "Product 2", status: "Shipped" },
];

const AdminPage = () => {
    // const { fetchAllProducts } = useProductStore();
    const [activeTab, setActiveTab] = useState("create");

    // useEffect(() => {
    //     fetchAllProducts();
    // }, [fetchAllProducts]);

    return (
        <div className="min-h-screen bg-[#F2F2F2] py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

                <div className="flex justify-center space-x-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-gray-800 border hover:bg-green-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    {activeTab === "create" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
                            {/* Product creation form will go here */}
                            <p className="text-gray-500">Product creation functionality not implemented yet.</p>
                        </div>
                    )}

                    {activeTab === "products" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Products</h2>
                            <ul className="space-y-2">
                                {dummyProducts.map((product) => (
                                    <li key={product.id} className="p-4 border rounded">
                                        {product.name} - {product.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Orders</h2>
                            <ul className="space-y-2">
                                {dummyOrders.map((order) => (
                                    <li key={order.id} className="p-4 border rounded">
                                        Order #{order.id} - {order.product} - {order.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
