import React from "react";
import { useParams } from "react-router-dom";
import accessories from "../../data/accessories.js";

const AccessoryPage = () => {
    const { id } = useParams();

    // Find the accessory by ID
    const accessory = accessories.find((item) => item.id === id);

    if (!accessory) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
                Accessory not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen  text-gray-900 px-6 py-12 max-w-5xl mt-10 mx-auto">
            {/* Top Section - Image + Basic Info */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Accessory Image */}
                <div className="bg-white rounded-xl shadow p-4">
                    <img
                        src={accessory.image}
                        alt={accessory.name}
                        className="w-full h-auto rounded-lg object-contain max-h-[400px]"
                    />
                </div>

                {/* Accessory Details */}
                <div className="flex flex-col justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{accessory.name}</h1>

                        <p className="text-2xl text-green-600 font-semibold mb-4">
                            ${accessory.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">{accessory.description}</p>

                        {/* Deal or Availability */}
                        {accessory.onDeal && (
                            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                {accessory.discountPercent}% OFF Deal
                            </span>
                        )}

                        <p className={`font-semibold ${accessory.status === "AVAILABLE" ? "text-green-600" : "text-red-500"}`}>
                            {accessory.status}
                        </p>
                    </div>

                    <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold text-lg transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-12" />

            {/* Shipping & Return Info */}
            <div className="text-sm text-gray-700 space-y-4">
                <h2 className="text-xl font-semibold mb-2">Shipping & Returns</h2>
                <p>
                    Free delivery within 2–4 business days across Canada & US. 30-day return policy.
                    No restocking fee. Accessories are packaged securely to ensure safe arrival.
                </p>
                <p><strong>ID:</strong> {accessory.id}</p>
                <p><strong>Added on:</strong> {accessory.createdAt}</p>
            </div>
        </div>
    );
};

export default AccessoryPage;
