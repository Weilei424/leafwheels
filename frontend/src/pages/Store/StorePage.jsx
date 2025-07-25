import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import Pagination from "../../components/common/Pagination/Pagination.jsx";
import { SearchBar } from "../../components/common/SearchBar/SearchBar.jsx";
import SortDropDown from "../../components/common/SortDropDown/SortDropDown.jsx";
import CategoryFilter from "../../components/common/CategoryFilter/CategoryFilter.jsx";
import StatusFilter from "../../components/common/StatusFilter/StatusFilter.jsx";
import VehicleCard from "../../components/vehicle/VehicleCard.jsx";
import AccessoryCard from "../../components/accessory/AccessoryCard.jsx";
import categories from "../../data/categories.js";
import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { useAccessoryStore } from "../../stores/useAccessoryStore.js";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";

const PAGE_SIZE = 8;

const useStoreLogic = (products) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const sortOrder = searchParams.get("sort") || "newest";
  const statusFilter = searchParams.get("status") || "available";

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      result = result.filter((p) => {
        const name =
            p.category === "Vehicles"
                ? `${p.year} ${p.make} ${p.model}`
                : p.name || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    switch (sortOrder) {
      case "priceLowHigh":
        return [...result].sort(
            (a, b) =>
                (a.discountPrice || a.price || 0) -
                (b.discountPrice || b.price || 0)
        );
      case "priceHighLow":
        return [...result].sort(
            (a, b) =>
                (b.discountPrice || b.price || 0) -
                (a.discountPrice || a.price || 0)
        );
      default:
        return [...result].sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
  }, [products, searchTerm, selectedCategory, sortOrder]);

  const updateParam = (key, value, defaultValue = null) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === defaultValue) newParams.delete(key);
      else newParams.set(key, value);
      return newParams;
    });
  };

  return {
    searchTerm,
    selectedCategory,
    sortOrder,
    statusFilter,
    filteredProducts,
    setSearchTerm: (value) => updateParam("search", value, ""),
    setSelectedCategory: (value) => updateParam("category", value, "All"),
    setSortOrder: (value) => updateParam("sort", value, "newest"),
    setStatusFilter: (value) => updateParam("status", value, "available"),
    clearAllFilters: () => setSearchParams(new URLSearchParams()),
    hasActiveFilters:
        searchTerm || selectedCategory !== "All" || statusFilter !== "available",
  };
};

const StorePage = () => {
  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    getAvailableVehicles,
    getVehiclesByStatus,
  } = useVehicleStore();

  const {
    accessories,
    loading: accessoriesLoading,
    error: accessoriesError,
    getAllAccessories,
  } = useAccessoryStore();

  const [pageItems, setPageItems] = useState([]);

  // Combine vehicles and accessories
  const products = useMemo(() => {
    const vehicleProducts = vehicles.map((v) => ({ ...v, category: "Vehicles" }));
    const accessoryProducts = accessories.map((a) => ({ ...a, category: "Accessories" }));
    return [...vehicleProducts, ...accessoryProducts];
  }, [vehicles, accessories]);

  const {
    searchTerm,
    selectedCategory,
    sortOrder,
    statusFilter,
    filteredProducts,
    setSearchTerm,
    setSelectedCategory,
    setSortOrder,
    setStatusFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useStoreLogic(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicles
        if (statusFilter === "pending") {
          await getVehiclesByStatus(["PENDING"]);
        } else {
          await getAvailableVehicles();
        }

        // Fetch accessories
        await getAllAccessories();
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [statusFilter]);

  const onAddToCart = (product) => {
    handleAddToCart({
      product,
      type: product.category === "Vehicles" ? "VEHICLE" : "ACCESSORY",
    });
  };

  const loading = vehiclesLoading || accessoriesLoading;
  const error = vehiclesError || accessoriesError;

  if (error) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <p className="text-red-600 text-lg">Error: {error}</p>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                    statusFilter === "available"
                        ? getAvailableVehicles()
                        : setStatusFilter(statusFilter)
                }
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen mt-6 py-8 px-4 max-w-7xl mx-auto"
      >
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl mb-12 text-center font-bold text-gray-900"
        >
          Store
        </motion.h1>

        {/* Clean Filters */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles and accessories..."
          />
          <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChangeCategory={setSelectedCategory}
          />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <SortDropDown
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={[
                { value: "newest", label: "Newest" },
                { value: "priceLowHigh", label: "Price: Low to High" },
                { value: "priceHighLow", label: "Price: High to Low" },
              ]}
          />
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-2 text-sm">
                  {searchTerm && (
                      <FilterTag onRemove={() => setSearchTerm("")}>
                        "{searchTerm}"
                      </FilterTag>
                  )}
                  {selectedCategory !== "All" && (
                      <FilterTag onRemove={() => setSelectedCategory("All")}>
                        {selectedCategory}
                      </FilterTag>
                  )}
                  {statusFilter !== "available" && (
                      <FilterTag onRemove={() => setStatusFilter("available")}>
                        {statusFilter}
                      </FilterTag>
                  )}
                  <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearAllFilters}
                      className="ml-2 text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </motion.button>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-20"
            >
              <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"
              />
            </motion.div>
        ) : filteredProducts.length === 0 ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
              <p className="text-gray-500 mb-4">
                No {selectedCategory === "All" ? "products" : selectedCategory.toLowerCase()} found
              </p>
              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAllFilters}
                  className="text-gray-900 underline hover:no-underline"
              >
                Clear filters
              </motion.button>
            </motion.div>
        ) : (
            <>
              {/* Results Grid */}
              <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                <AnimatePresence>
                  {pageItems.map((product) => (
                      <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="cursor-pointer"
                      >
                        {product.category === "Vehicles" ? (
                            <VehicleCard
                                vehicle={product}
                                onAddToCart={() => onAddToCart(product)}
                            />
                        ) : (
                            <AccessoryCard
                                accessory={product}
                                onAddToCart={() => onAddToCart(product)}
                            />
                        )}
                      </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Clean Pagination */}
              <Pagination
                  items={filteredProducts}
                  pageLimit={PAGE_SIZE}
                  setPageItems={setPageItems}
              />
            </>
        )}
      </motion.div>
  );
};

const FilterTag = ({ children, onRemove }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm border"
    >
      {children}
      <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
      >
        ×
      </motion.button>
    </motion.span>
);

export default StorePage;