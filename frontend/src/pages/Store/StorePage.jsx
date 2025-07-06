import { useState, useMemo } from "react";

const products = [
    {
        _id: "1",
        name: "Tesla Model 3",
        price: 39990.0,
        image:
            "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg",
        category: "Electric Cars",
        createdAt: "2024-06-01",
    },
    {
        _id: "2",
        name: "Nissan Leaf",
        price: 27400.0,
        image:
            "https://hips.hearstapps.com/hmg-prod/images/2025-nissan-leaf-121-6690462ff1899.jpg?auto=format&fit=crop&w=600&q=80",
        category: "Electric Cars",
        createdAt: "2024-05-15",
    },
    {
        _id: "3",
        name: "EV Charging Cable",
        price: 149.99,
        image: "https://m.media-amazon.com/images/I/61usxWzJdkL.jpg",
        category: "Chargers",
        createdAt: "2024-04-10",
    },
    {
        _id: "4",
        name: "Wall Charger Station",
        price: 349.99,
        image:
            "https://evocharge.com/wp-content/uploads/2021/02/GettyImages-1249775796.jpg",
        category: "Chargers",
        createdAt: "2024-06-10",
    },
    {
        _id: "5",
        name: "Portable EV Charger",
        price: 599.99,
        image:
            "https://www.shutterstock.com/image-photo/portable-ev-charger-electric-vehicle-600nw-2314986427.jpg",
        category: "Chargers",
        createdAt: "2024-03-22",
    },
    {
        _id: "6",
        name: "Car Cover",
        price: 149.99,
        image:
            "https://images.weathertech.com/7456a866-b1d2-4634-82b0-b1a8013eb661/bmw_m3_car_cover_darkblue_Original%20file.jpg?width=800&height=800&fit=bounds",
        category: "Accessories",
        createdAt: "2024-01-05",
    },
];

const categories = ["All", "Electric Cars", "Chargers", "Accessories"];
const PAGE_SIZE = 4;

const ProductCard = ({ product }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div className="flex justify-center p-4 bg-gray-50 rounded-md">
            <img src={product.image} alt={product.name} className="h-48 object-contain" />
        </div>
        <div className="mt-4 flex flex-col flex-grow">
            <h3 className="text-gray-900 text-lg font-semibold">{product.name}</h3>
            <p className="text-green-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
            <button className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300">
                Add to Cart
            </button>
        </div>
    </div>
);

const CategoryFilter = ({ categories, selectedCategory, onChangeCategory }) => (
    <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const baseClasses = "px-4 py-2 rounded-full border transition-colors duration-300";
            const selectedClasses = "bg-green-600 text-white border-green-600";
            const defaultClasses = "border-gray-300 text-gray-700 hover:bg-green-100";

            return (
                <button
                    key={category}
                    onClick={() => onChangeCategory(category)}
                    className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
                >
                    {category}
                </button>
            );
        })}
    </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Pagination" className="flex justify-center mt-12 space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-green-100"
            >
                Prev
            </button>

            {pages.map((page) => {
                const isActive = currentPage === page;
                const baseClasses = "px-3 py-1 rounded border";
                const activeClasses = "bg-green-600 text-white border-green-600";
                const inactiveClasses = "border-gray-300 bg-white hover:bg-green-100";

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={isActive ? "page" : undefined}
                        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-green-100"
            >
                Next
            </button>
        </nav>
    );
};

const StorePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const onSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const onCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const onSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const filterProducts = () => {
        let filtered = products;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortOrder) {
            case "priceLowHigh":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "priceHighLow":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "newest":
            default:
                filtered.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
        }

        return filtered;
    };

    const filteredProducts = useMemo(filterProducts, [
        selectedCategory,
        searchTerm,
        sortOrder,
    ]);

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const onPageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 py-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center">Store</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    className="w-full sm:max-w-xs rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Search products"
                />

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChangeCategory={onCategoryChange}
                />

                <select
                    value={sortOrder}
                    onChange={onSortOrderChange}
                    className="w-full sm:max-w-xs rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Sort products"
                >
                    <option value="newest">Sort by: Newest</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                </select>
            </div>

            {paginatedProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default StorePage;
