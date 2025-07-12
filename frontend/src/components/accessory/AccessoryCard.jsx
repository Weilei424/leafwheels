import React from "react";
import { Link } from "react-router-dom";

const AccessoryCard = ({ accessory }) => (
    <Link to={`/accessory/${accessory.id}`}>
        <div
            className="
        rounded-lg           /* Rounded corners */
        border               /* Border */
        border-gray-200      /* Light gray border */
        bg-white             /* White background */
        p-4                  /* Padding */
        shadow-sm            /* Subtle shadow */
        hover:shadow-md      /* Larger shadow on hover */
        transition-shadow    /* Smooth shadow transition */
        flex flex-col        /* Vertical layout */
      "
        >
            {/* Image container */}
            <div
                className="
          flex justify-center
          p-4
          bg-gray-50
          rounded-md
        "
            >
                <img
                    src={accessory.image}
                    alt={accessory.name}
                    className="h-48 object-contain"
                />
            </div>

            {/* Accessory details */}
            <div className="mt-4 flex flex-col flex-grow">
                <h3 className="text-gray-900 text-lg font-sans">{accessory.name}</h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                    {accessory.description}
                </p>

                <p className="text-black font-semibold mt-2">
                    ${accessory.price.toFixed(2)}
                </p>

                <button
                    className="
            bg-green-600
            hover:bg-green-700
            text-white
            font-semibold
            py-2 px-4
            mt-2
            rounded
            focus:outline-none
            focus:ring-2 focus:ring-green-500
            transition-colors duration-300
          "
                    aria-label={`Add ${accessory.name} to cart`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </Link>
);

export default AccessoryCard;
