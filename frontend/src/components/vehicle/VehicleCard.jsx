import React from "react";
import { Link } from "react-router-dom";

const VehicleCard = ({ vehicle, onAddToCart  }) => {
    return (
        <Link to={`/vehicle/${vehicle.id}`}>
            <div className="
                rounded-lg border border-gray-200 bg-white p-4 shadow-sm
                hover:shadow-md transition-shadow flex flex-col
            ">
                {/* Image */}
                <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                    <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-48 object-contain"
                    />
                </div>

                {/* Details */}
                <div className="mt-4 flex flex-col flex-grow">
                    <h3 className="text-gray-900 text-lg font-sans">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-black font-semibold mt-1">
                        ${vehicle.price.toFixed(2)}
                    </p>

                    {/* Add to Cart */}
                    <button
                        className="
                            bg-green-600 hover:bg-green-700
                            text-white font-semibold py-2 px-4 mt-2 rounded
                            focus:outline-none focus:ring-2 focus:ring-green-500
                            transition-colors duration-300
                        "
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(vehicle);  // pass full vehicle here
                        }}
                        aria-label={`Add ${vehicle.make} ${vehicle.model} to cart`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default VehicleCard;
