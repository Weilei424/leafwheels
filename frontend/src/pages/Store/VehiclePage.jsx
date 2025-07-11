import React from "react";
import { useParams } from "react-router-dom";
import vehicles from "../../data/vehicles.js";

const VehiclePage = () => {
    const { id } = useParams();

    // Find the vehicle by ID
    const vehicle = vehicles.find((vehicle) => vehicle.id === id);

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
                Vehicle not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-12 max-w-7xl mt-10 mx-auto">
            {/* Top Section - Image + Basic Info */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Vehicle Image */}
                <div className="bg-white rounded-xl shadow p-4">
                    <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                    />
                </div>

                {/* Vehicle Details */}
                <div className="flex flex-col justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>

                        <p className="text-2xl text-green-600 font-semibold mb-4">
                            ${vehicle.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4">{vehicle.description}</p>

                        {/* Deal / Availability */}
                        {vehicle.onDeal && (
                            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {vehicle.discountPercent}% OFF Deal
              </span>
                        )}
                        <p className={`font-semibold ${vehicle.status === "AVAILABLE" ? "text-green-600" : "text-red-500"}`}>
                            {vehicle.status}
                        </p>
                    </div>

                    <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold text-lg transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-12" />

            {/* Specifications Grid */}
            <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-700">
                {/* Vehicle Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Vehicle Specs</h2>
                    <ul className="space-y-1">
                        <li><strong>Body Type:</strong> {vehicle.bodyType}</li>
                        <li><strong>Trim:</strong> {vehicle.trim}</li>
                        <li><strong>Color:</strong> {vehicle.exteriorColor}</li>
                        <li><strong>Doors:</strong> {vehicle.doors}</li>
                        <li><strong>Seats:</strong> {vehicle.seats}</li>
                        <li><strong>Battery Range:</strong> {vehicle.batteryRange} km</li>
                        <li><strong>Mileage:</strong> {vehicle.mileage.toLocaleString()} km</li>
                        <li><strong>Condition:</strong> {vehicle.condition}</li>
                    </ul>
                </div>

                {/* Technical Details */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
                    <ul className="space-y-1">
                        <li><strong>VIN:</strong> {vehicle.vin}</li>
                        <li><strong>Release Date:</strong> {vehicle.createdAt}</li>
                        <li><strong>ID:</strong> {vehicle.id}</li>
                    </ul>
                </div>

                {/* Shipping Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping & Returns</h2>
                    <p>
                        Free delivery within 2–4 business days across Canada & US. 30-day return policy. No restocking fee.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VehiclePage;
