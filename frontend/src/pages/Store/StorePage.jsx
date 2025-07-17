import React, { useEffect, useMemo, useState } from "react";
import usePagination from "../../hooks/UsePagination.js";
import { SearchBar } from "../../components/common/SearchBar/SearchBar.jsx";
import SortDropDown from "../../components/common/SortDropDown/SortDropDown.jsx";
import CategoryFilter from "../../components/common/CategoryFilter/CategoryFilter.jsx";
import VehicleCard from "../../components/vehicle/VehicleCard.jsx";
import AccessoryCard from "../../components/accessory/AccessoryCard.jsx";
import categories from "../../data/categories.js";
import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 4;

const StorePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");

    // Get and set query params from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page") || "0", 10);

    const {vehicles, getAllVehicles} = useVehicleStore();

    const onAddToCart = (product) => {
        const type = product.category === "Vehicles" ? "VEHICLE" : "ACCESSORY";
        handleAddToCart({product, type});
    };

    useEffect(() => {
        getAllVehicles();
    }, [getAllVehicles]);

    const products = useMemo(() => [
        ...vehicles.map(vehicle => ({...vehicle, category: "Vehicles"})),
        // Add accessories here if needed
    ], [vehicles]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((p) => {
                const nameToCheck = p.category === "Vehicles"
                    ? `${p.year} ${p.make} ${p.model}`
                    : p.name || "";
                return nameToCheck.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        switch (sortOrder) {
            case "priceLowHigh":
                filtered = [...filtered].sort((a, b) => a.price - b.price);
                break;
            case "priceHighLow":
                filtered = [...filtered].sort((a, b) => b.price - a.price);
                break;
            case "newest":
            default:
                filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return filtered;
    }, [products, searchTerm, selectedCategory, sortOrder]);

    // Use pagination hook with initial page from URL
    const {
        pageNumber,
        pageCount,
        changePage,
        pageData,
        nextPage,
        previousPage,
    } = usePagination(filteredProducts, PAGE_SIZE, initialPage);

    // Sync page changes to URL query param `page`
    useEffect(() => {
        setSearchParams(prev => {
            if (pageNumber === 0) {
                prev.delete("page");
            } else {
                prev.set("page", pageNumber);
            }
            return prev;
        });
    }, [pageNumber, setSearchParams]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 py-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center">Store</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        changePage(0);
                    }}
                    placeholder="Search products..."
                />

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChangeCategory={(category) => {
                        setSelectedCategory(category);
                        changePage(0);
                    }}
                />

                <SortDropDown
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value);
                        changePage(0);
                    }}
                    options={[
                        {value: "newest", label: "Sort by: Newest"},
                        {value: "priceLowHigh", label: "Price: Low to High"},
                        {value: "priceHighLow", label: "Price: High to Low"},
                    ]}
                />
            </div>

            {pageData.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pageData.map((product) =>
                        product.category === "Vehicles" ? (
                            <VehicleCard key={product.id} vehicle={product} onAddToCart={onAddToCart}/>
                        ) : (
                            <AccessoryCard key={product.id} accessory={product}/>
                        )
                    )}
                </div>
            )}

            {pageCount > 1 && (
                <nav aria-label="Pagination" className="flex justify-center mt-12 space-x-2">
                    <button
                        onClick={previousPage}
                        disabled={pageNumber === 0}
                        className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-green-100"
                    >
                        Prev
                    </button>

                    {[...Array(pageCount).keys()].map((pageIdx) => {
                        const isActive = pageNumber === pageIdx;
                        const baseClasses = "px-3 py-1 rounded border";
                        const activeClasses = "bg-green-600 text-white border-green-600";
                        const inactiveClasses = "border-gray-300 bg-white hover:bg-green-100";

                        return (
                            <button
                                key={pageIdx}
                                onClick={() => changePage(pageIdx)}
                                aria-current={isActive ? "page" : undefined}
                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                {pageIdx + 1}
                            </button>
                        );
                    })}

                    <button
                        onClick={nextPage}
                        disabled={pageNumber === pageCount - 1}
                        className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-green-100"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
};

export default StorePage;