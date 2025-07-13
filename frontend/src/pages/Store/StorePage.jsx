import React, {useEffect, useMemo, useState} from "react";
import usePagination from "../../hooks/UsePagination.js";
import {SearchBar} from "../../components/common/SearchBar/SearchBar.jsx";
import SortDropDown from "../../components/common/SortDropDown/SortDropDown.jsx";
import CategoryFilter from "../../components/common/CategoryFilter/CategoryFilter.jsx";
import VehicleCard from "../../components/vehicle/VehicleCard.jsx";
import AccessoryCard from "../../components/accessory/AccessoryCard.jsx";
import categories from "../../data/categories.js";
import {useVehicleStore} from "../../stores/useVehicleStore.js";









const PAGE_SIZE = 4;

const Pagination = ({ currentPage, totalPages, onPageChange, onNextPage, onPreviousPage }) => {

    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 0; i < totalPages; i++) { // Loop from 0 to totalPages - 1 (0-indexed)
        pages.push(i);
    }

    return (
        <nav aria-label="Pagination" className="flex justify-center mt-12 space-x-2">
            <button
                onClick={onPreviousPage} // Use the onPreviousPage function directly
                disabled={currentPage === 0} // Disable if on the first (0-indexed) page
                className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-green-100"
            >
                Prev
            </button>

            {pages.map((pageIndex) => { // pageIndex will be 0, 1, 2...
                const isActive = currentPage === pageIndex;
                const baseClasses = "px-3 py-1 rounded border";
                const activeClasses = "bg-green-600 text-white border-green-600";
                const inactiveClasses = "border-gray-300 bg-white hover:bg-green-100";

                return (
                    <button
                        key={pageIndex}
                        onClick={() => onPageChange(pageIndex)} // Pass the 0-indexed page number
                        aria-current={isActive ? "page" : undefined}
                        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        {pageIndex + 1} {/* Display 1-indexed page number to the user */}
                    </button>
                );
            })}

            <button
                onClick={onNextPage} // Use the onNextPage function directly
                disabled={currentPage === totalPages - 1} // Disable if on the last (0-indexed) page
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

    const { vehicles, getAllVehicles } = useVehicleStore();

    useEffect(() => {
        getAllVehicles()
    }, [getAllVehicles]);





    const products = useMemo(() => [
        ...vehicles.map(vehicle => ({ ...vehicle, category: "Vehicles" })),
        // ...accessories.map(accessory => ({ ...accessory, category: "Accessories" })),
    ], [vehicles]);


    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((p) => {
                let nameToCheck;

                if (p.category === "Vehicles") {
                    nameToCheck =  p.year + " " + p.make + " " + p.model;
                } else {
                    nameToCheck = p.name || "";
                }

                return nameToCheck.toLowerCase().includes(searchTerm.toLowerCase());
            });

        }

        switch (sortOrder) {
            case "priceLowHigh":
                // Create a shallow copy before sorting to avoid modifying the original array
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

    const {
        pageNumber,
        pageCount,
        changePage,
        pageData,       // pageData is now the memoized array itself
        nextPage,
        previousPage,
    } = usePagination(filteredProducts, PAGE_SIZE);

    // Directly use pageData, as it's already the memoized array
    const currentPageData = pageData;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 py-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center">Store</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                {/* calling reusable component*/}
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
                        changePage(0); // Reset to the first page (0-indexed)
                    }}
                />

                <SortDropDown
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value);
                        changePage(0);
                    }}
                    options={[
                        { value: "newest", label: "Sort by: Newest" },
                        { value: "priceLowHigh", label: "Price: Low to High" },
                        { value: "priceHighLow", label: "Price: High to Low" },
                    ]}
                />

            </div>

            {currentPageData.length === 0 && (
                <p className="text-center text-gray-500">No products found.</p>
            )}

            {currentPageData.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentPageData.map((product) =>
                        product.category === "Vehicles" ? (
                            <VehicleCard key={product.id} vehicle={product}/>
                        ) : (
                            <AccessoryCard key={product.id} accessory={product}/>
                        )
                    )}
                </div>
            )}


            <Pagination
                currentPage={pageNumber} // Pass the 0-indexed pageNumber
                totalPages={pageCount}
                onPageChange={changePage} // Still used for direct page number clicks
                onNextPage={nextPage}      // Pass the nextPage function from the hook
                onPreviousPage={previousPage} // Pass the previousPage function from the hook
            />
        </div>
    );
};

export default StorePage;