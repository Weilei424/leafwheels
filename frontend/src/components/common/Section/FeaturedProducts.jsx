const FeaturedProducts = ({ featuredProducts }) => {
    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-4xl font-bold text-gray-900 mb-10">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredProducts?.map((product) => (
                        <div
                            key={product._id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                        >
                            <div className="flex justify-center p-4  rounded-md">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-48 object-contain"
                                />
                            </div>
                            <div className="mt-4 flex flex-col flex-grow">
                                <h3 className="text-gray-900 text-lg font-semibold">{product.name}</h3>
                                <p className="text-green-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
                                <button
                                    className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
