import React from "react";

const ProductCard = ({ product }) => (
    <div
        className="
      rounded-lg           /* Rounded corners for smooth edges */
      border               /* Border for separation */
      border-gray-200      /* Light gray border color */
      bg-white             /* White background */
      p-4                  /* Padding inside the card */
      shadow-sm            /* Small shadow for subtle depth */
      hover:shadow-md      /* Larger shadow on hover for emphasis */
      transition-shadow    /* Smooth transition of shadow on hover */
      flex flex-col        /* Vertical layout */
    "
    >
        {/* Image container */}
        <div
            className="
        flex justify-center      /* Center image horizontally */
        p-4                     /* Padding around image */
        bg-gray-50              /* Light gray background for image container */
        rounded-md              /* Slightly rounded corners */
      "
        >
            {/* Product image */}
            <img
                src={product.image}
                alt={product.name}
                className="h-48 object-contain" /* Fixed height, maintain aspect ratio */
            />
        </div>

        {/* Product details section */}
        <div className="mt-4 flex flex-col flex-grow">
            {/* Product name */}
            <h3 className="text-gray-900 text-lg font-sans">
                {product.name}
            </h3>

            {/* Product price */}
            <p className="text-black text-bold font-semibold mt-1">
                ${product.price.toFixed(2)}
            </p>

            {/* Add to Cart button */}
            <button
                className="
          bg-green-600                 /* Green background */
          hover:bg-green-700           /* Darker green on hover */
          text-white                  /* White text */
          font-semibold                /* Semi-bold font */
          py-2 px-4                   /* Padding on y and x axes */
          m-2 mt-2                    /* Margin on top */
          rounded                     /* Rounded corners */
          focus:outline-none          /* Remove default focus outline */
          focus:ring-2 focus:ring-green-500 /* Green focus ring for accessibility */
          transition-colors duration-300     /* Smooth color transitions */
        "
                aria-label={`Add ${product.name} to cart`}
            >
                Add to Cart
            </button>
        </div>
    </div>
);

export default ProductCard;
