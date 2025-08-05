import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import Pagination from "../../components/common/Pagination/Pagination.jsx";
import { SearchBar } from "../../components/common/SearchBar/SearchBar.jsx";
import SortDropDown from "../../components/common/SortDropDown/SortDropDown.jsx";
import CategoryFilter from "../../components/common/CategoryFilter/CategoryFilter.jsx";
import VehicleCard from "../../components/vehicle/VehicleCard.jsx";
import AccessoryCard from "../../components/accessory/AccessoryCard.jsx";
import categories from "../../data/categories.js";
import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { useAccessoryStore } from "../../stores/useAccessoryStore.js";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";
import FloatingComparison from "../../components/vehicle/FloatingComparison.jsx";



// Configuration
const PRODUCTS_PER_PAGE = 8;
const DEFAULT_SEARCH_TERM = "";
const DEFAULT_CATEGORY = "All";
const DEFAULT_SORT_ORDER = "newest";

const DEFAULT_BRAND_FILTER = "all";
const DEFAULT_BODY_TYPE_FILTER = "all";
const DEFAULT_YEAR_FILTER = "all";
const DEFAULT_ACCIDENT_HISTORY_FILTER = "all";
const DEFAULT_MIN_PRICE = "";
const DEFAULT_MAX_PRICE = "";
const DEFAULT_MIN_MILEAGE = "";
const DEFAULT_MAX_MILEAGE = "";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "mileageLowHigh", label: "Mileage: Low to High" },
  { value: "mileageHighLow", label: "Mileage: High to Low" }
];

// Electric vehicle filter options based on your Java enums
const VEHICLE_BRANDS = [
  { value: "all", label: "All Brands" },
  { value: "TESLA", label: "Tesla" },
  { value: "NISSAN", label: "Nissan" },
  { value: "CHEVROLET", label: "Chevrolet" },
  { value: "FORD", label: "Ford" },
  { value: "AUDI", label: "Audi" },
  { value: "BMW", label: "BMW" },
  { value: "HYUNDAI", label: "Hyundai" },
  { value: "KIA", label: "Kia" },
  { value: "VOLKSWAGEN", label: "Volkswagen" },
  { value: "PORSCHE", label: "Porsche" },
  { value: "JAGUAR", label: "Jaguar" },
  { value: "RIVIAN", label: "Rivian" },
  { value: "LUCID", label: "Lucid" },
  { value: "MERCEDES_BENZ", label: "Mercedes-Benz" },
  { value: "VOLVO", label: "Volvo" },
  { value: "POLESTAR", label: "Polestar" },
  { value: "TOYOTA", label: "Toyota" },
  { value: "MAZDA", label: "Mazda" }
];

const VEHICLE_BODY_TYPES = [
  { value: "all", label: "All Shapes" },
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "COUPE", label: "Coupe" },
  { value: "CONVERTIBLE", label: "Convertible" },
  { value: "WAGON", label: "Wagon" },
  { value: "MINIVAN", label: "Minivan" },
  { value: "TRUCK", label: "Truck" },
  { value: "CROSSOVER", label: "Crossover" }
];

const MODEL_YEARS = [
  { value: "all", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" }
];

const ACCIDENT_HISTORY_OPTIONS = [
  { value: "all", label: "All Vehicles" },
  { value: "no_accidents", label: "No Accident History" },
  { value: "with_accidents", label: "With Accident History" }
];

// Utility functions
function formatProductDisplayName(product) {
  if (product.category === "Vehicles") {
    return `${product.year} ${product.make} ${product.model}`;
  }
  return product.name || "";
}

function productHasDiscount(product) {
  return product.discountPercentage && product.discountPercentage * 100 > 0;
}

// Map frontend sort options to backend Spring Boot Pageable sort parameters
function mapSortOrderToBackendSort(sortOrder) {
  switch (sortOrder) {
    case "priceLowHigh":
      return "price,asc";
    case "priceHighLow":
      return "price,desc";
    case "mileageLowHigh":
      return "mileage,asc";
    case "mileageHighLow":
      return "mileage,desc";
    case "newest":
    default:
      return "createdAt,desc";
  }
}

// Build filter parameters for backend API
function buildVehicleFilterParameters(filters, sortOrder) {
  const params = {};

  // Handle brand filter
  if (filters.brandFilter && filters.brandFilter !== DEFAULT_BRAND_FILTER) {
    params.make = filters.brandFilter;
  }

  // Handle body type filter
  if (filters.bodyTypeFilter && filters.bodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER) {
    params.bodyType = filters.bodyTypeFilter;
  }

  // Handle year filter
  if (filters.yearFilter && filters.yearFilter !== DEFAULT_YEAR_FILTER) {
    if (filters.yearFilter === "older") {
      // For older vehicles, we'll filter on frontend since backend doesn't have maxYear
      // This will be handled in frontend filtering
    } else {
      params.year = parseInt(filters.yearFilter);
    }
  }

  // Handle accident history filter
  if (filters.accidentHistoryFilter && filters.accidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER) {
    if (filters.accidentHistoryFilter === "no_accidents") {
      params.hasAccidentHistory = false;
    } else if (filters.accidentHistoryFilter === "with_accidents") {
      params.hasAccidentHistory = true;
    }
  }

  // Handle price range filters
  if (filters.minPrice && filters.minPrice !== DEFAULT_MIN_PRICE) {
    params.minPrice = parseFloat(filters.minPrice);
  }
  if (filters.maxPrice && filters.maxPrice !== DEFAULT_MAX_PRICE) {
    params.maxPrice = parseFloat(filters.maxPrice);
  }

  // Handle mileage range filters
  if (filters.minMileage && filters.minMileage !== DEFAULT_MIN_MILEAGE) {
    params.minMileage = parseInt(filters.minMileage);
  }
  if (filters.maxMileage && filters.maxMileage !== DEFAULT_MAX_MILEAGE) {
    params.maxMileage = parseInt(filters.maxMileage);
  }



  // Add sorting parameters for Spring Boot Pageable
  const backendSort = mapSortOrderToBackendSort(sortOrder);
  params.sort = backendSort;

  return params;
}

// Apply frontend filtering for accessories, search, and special cases
function applyFrontendFilters(products, searchTerm, selectedCategory, yearFilter) {
  let filteredProducts = [...products];

  // Apply category filter
  if (selectedCategory === "Hot Deal Vehicles") {
    filteredProducts = filteredProducts.filter(product =>
        product.category === "Vehicles" && productHasDiscount(product)
    );
  } else if (selectedCategory === "Hot Deal Accessories") {
    filteredProducts = filteredProducts.filter(product =>
        product.category === "Accessories" && productHasDiscount(product)
    );
  } else if (selectedCategory === "Hot Deals") {
    filteredProducts = filteredProducts.filter(productHasDiscount);
  } else if (selectedCategory !== DEFAULT_CATEGORY) {
    filteredProducts = filteredProducts.filter(product =>
        product.category === selectedCategory
    );
  }

  // Apply search filter
  if (searchTerm.trim()) {
    const searchTermLowerCase = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product => {
      const productDisplayName = formatProductDisplayName(product);
      return productDisplayName.toLowerCase().includes(searchTermLowerCase);
    });
  }

  // Apply "older" year filter on frontend (since backend doesn't support maxYear)
  if (yearFilter === "older") {
    filteredProducts = filteredProducts.filter(product => {
      if (product.category !== "Vehicles") return true;
      return product.year && product.year <= 2017;
    });
  }

  return filteredProducts;
}

// Frontend sorting for all products when not using backend filtering
function sortAllProducts(products, sortOrder) {
  const productsCopy = [...products];

  if (sortOrder === "priceLowHigh") {
    return productsCopy.sort((a, b) =>
        (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0)
    );
  }

  if (sortOrder === "priceHighLow") {
    return productsCopy.sort((a, b) =>
        (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0)
    );
  }

  if (sortOrder === "mileageLowHigh") {
    return productsCopy.sort((a, b) => {
      // Only sort vehicles by mileage, keep accessories in original order
      if (a.category === "Vehicles" && b.category === "Vehicles") {
        return (a.mileage || 0) - (b.mileage || 0);
      }
      if (a.category === "Vehicles") return -1;
      if (b.category === "Vehicles") return 1;
      return 0;
    });
  }

  if (sortOrder === "mileageHighLow") {
    return productsCopy.sort((a, b) => {
      // Only sort vehicles by mileage, keep accessories in original order
      if (a.category === "Vehicles" && b.category === "Vehicles") {
        return (b.mileage || 0) - (a.mileage || 0);
      }
      if (a.category === "Vehicles") return -1;
      if (b.category === "Vehicles") return 1;
      return 0;
    });
  }

  // Default: newest first
  return productsCopy.sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
}

// Frontend sorting for accessories only (vehicles are sorted by backend)
function sortAccessoriesOnly(products, sortOrder) {
  const productsCopy = [...products];

  // Separate vehicles and accessories
  const vehicles = productsCopy.filter(p => p.category === "Vehicles");
  const accessories = productsCopy.filter(p => p.category === "Accessories");

  // Sort accessories on frontend (vehicles are already sorted by backend)
  let sortedAccessories = accessories;

  if (sortOrder === "priceLowHigh") {
    sortedAccessories = accessories.sort((a, b) =>
        (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0)
    );
  } else if (sortOrder === "priceHighLow") {
    sortedAccessories = accessories.sort((a, b) =>
        (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0)
    );
  } else if (sortOrder === "newest" || sortOrder === "mileageLowHigh" || sortOrder === "mileageHighLow") {
    // For newest and mileage sorts, just use creation date for accessories
    sortedAccessories = accessories.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  // Return vehicles (backend sorted) + accessories (frontend sorted)
  return [...vehicles, ...sortedAccessories];
}

// Enhanced dropdown filter component
function FilterDropdown({ label, value, onChange, options, className = "" }) {
  return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
        >
          {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>
      </div>
  );
}

// Input field for price and mileage ranges
function FilterInput({ label, value, onChange, placeholder, type = "number", className = "" }) {
  return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-24"
        />
      </div>
  );
}

// Custom hook for managing URL parameters and backend filtering
function useBackendFiltering(accessoryStore) {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleStore = useVehicleStore();

  const currentSearchTerm = searchParams.get("search") || DEFAULT_SEARCH_TERM;
  const currentSelectedCategory = searchParams.get("category") || DEFAULT_CATEGORY;
  const currentSortOrder = searchParams.get("sort") || DEFAULT_SORT_ORDER;
  const currentBrandFilter = searchParams.get("brand") || DEFAULT_BRAND_FILTER;
  const currentBodyTypeFilter = searchParams.get("bodyType") || DEFAULT_BODY_TYPE_FILTER;
  const currentYearFilter = searchParams.get("year") || DEFAULT_YEAR_FILTER;
  const currentAccidentHistoryFilter = searchParams.get("accidentHistory") || DEFAULT_ACCIDENT_HISTORY_FILTER;
  const currentMinPrice = searchParams.get("minPrice") || DEFAULT_MIN_PRICE;
  const currentMaxPrice = searchParams.get("maxPrice") || DEFAULT_MAX_PRICE;
  const currentMinMileage = searchParams.get("minMileage") || DEFAULT_MIN_MILEAGE;
  const currentMaxMileage = searchParams.get("maxMileage") || DEFAULT_MAX_MILEAGE;

  // Combine vehicles (from backend filtering) and accessories (frontend filtering)
  const allProducts = useMemo(() => {
    const vehiclesWithCategory = vehicleStore.vehicles.map(vehicle => ({
      ...vehicle,
      category: "Vehicles"
    }));

    const accessoriesWithCategory = accessoryStore.accessories.map(accessory => ({
      ...accessory,
      category: "Accessories"
    }));

    return [...vehiclesWithCategory, ...accessoriesWithCategory];
  }, [vehicleStore.vehicles, accessoryStore.accessories]);

  // Apply frontend filtering for accessories and search
  const filteredProducts = useMemo(() => {
    const frontendFiltered = applyFrontendFilters(
        allProducts,
        currentSearchTerm,
        currentSelectedCategory,
        currentYearFilter
    );

    // Check if we have backend filters to determine sorting strategy
    const hasBackendFilters = (
        currentBrandFilter !== DEFAULT_BRAND_FILTER ||
        currentBodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER ||
        currentYearFilter !== DEFAULT_YEAR_FILTER ||
        currentAccidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER ||
        currentMinPrice !== DEFAULT_MIN_PRICE ||
        currentMaxPrice !== DEFAULT_MAX_PRICE ||
        currentMinMileage !== DEFAULT_MIN_MILEAGE ||
        currentMaxMileage !== DEFAULT_MAX_MILEAGE
    );

    if (hasBackendFilters) {
      // Backend handles vehicle sorting, frontend handles accessories
      return sortAccessoriesOnly(frontendFiltered, currentSortOrder);
    } else {
      // Frontend handles all sorting (using original endpoints)
      return sortAllProducts(frontendFiltered, currentSortOrder);
    }
  }, [allProducts, currentSearchTerm, currentSelectedCategory, currentYearFilter, currentSortOrder, currentBrandFilter, currentBodyTypeFilter, currentAccidentHistoryFilter, currentMinPrice, currentMaxPrice, currentMinMileage, currentMaxMileage]);

  function updateUrlParameter(parameterName, newValue, defaultValue) {
    setSearchParams(previousParams => {
      const updatedParams = new URLSearchParams(previousParams);

      if (newValue === defaultValue) {
        updatedParams.delete(parameterName);
      } else {
        updatedParams.set(parameterName, newValue);
      }

      return updatedParams;
    });
  }

  function clearAllFilters() {
    setSearchParams(new URLSearchParams());
  }

  const hasActiveFilters = (
      currentSearchTerm !== DEFAULT_SEARCH_TERM ||
      currentSelectedCategory !== DEFAULT_CATEGORY ||
      currentBrandFilter !== DEFAULT_BRAND_FILTER ||
      currentBodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER ||
      currentYearFilter !== DEFAULT_YEAR_FILTER ||
      currentAccidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER ||
      currentMinPrice !== DEFAULT_MIN_PRICE ||
      currentMaxPrice !== DEFAULT_MAX_PRICE ||
      currentMinMileage !== DEFAULT_MIN_MILEAGE ||
      currentMaxMileage !== DEFAULT_MAX_MILEAGE
  );

  // Build filter parameters for backend API calls
  const vehicleFilters = useMemo(() => ({
    brandFilter: currentBrandFilter,
    bodyTypeFilter: currentBodyTypeFilter,
    yearFilter: currentYearFilter,
    accidentHistoryFilter: currentAccidentHistoryFilter,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    minMileage: currentMinMileage,
    maxMileage: currentMaxMileage
  }), [currentBrandFilter, currentBodyTypeFilter, currentYearFilter, currentAccidentHistoryFilter, currentMinPrice, currentMaxPrice, currentMinMileage, currentMaxMileage]);

  const sortOrder = currentSortOrder;

  return {
    searchTerm: currentSearchTerm,
    selectedCategory: currentSelectedCategory,
    brandFilter: currentBrandFilter,
    bodyTypeFilter: currentBodyTypeFilter,
    yearFilter: currentYearFilter,
    accidentHistoryFilter: currentAccidentHistoryFilter,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    minMileage: currentMinMileage,
    maxMileage: currentMaxMileage,
    filteredProducts,
    hasActiveFilters,
    vehicleFilters,
    sortOrder,
    setSearchTerm: (value) => updateUrlParameter("search", value, DEFAULT_SEARCH_TERM),
    setSelectedCategory: (value) => updateUrlParameter("category", value, DEFAULT_CATEGORY),
    setSortOrder: (value) => updateUrlParameter("sort", value, DEFAULT_SORT_ORDER),
    setBrandFilter: (value) => updateUrlParameter("brand", value, DEFAULT_BRAND_FILTER),
    setBodyTypeFilter: (value) => updateUrlParameter("bodyType", value, DEFAULT_BODY_TYPE_FILTER),
    setYearFilter: (value) => updateUrlParameter("year", value, DEFAULT_YEAR_FILTER),
    setAccidentHistoryFilter: (value) => updateUrlParameter("accidentHistory", value, DEFAULT_ACCIDENT_HISTORY_FILTER),
    setMinPrice: (value) => updateUrlParameter("minPrice", value, DEFAULT_MIN_PRICE),
    setMaxPrice: (value) => updateUrlParameter("maxPrice", value, DEFAULT_MAX_PRICE),
    setMinMileage: (value) => updateUrlParameter("minMileage", value, DEFAULT_MIN_MILEAGE),
    setMaxMileage: (value) => updateUrlParameter("maxMileage", value, DEFAULT_MAX_MILEAGE),
    clearAllFilters
  };
}

// UI Components
function ActiveFilterTag({ children, onRemoveFilter }) {
  return (
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
            onClick={onRemoveFilter}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
            aria-label="Remove this filter"
        >
          ×
        </motion.button>
      </motion.span>
  );
}

function LoadingSpinner() {
  return (
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
  );
}

function EmptyProductsMessage({ selectedCategory, onClearAllFilters }) {
  const productTypeText = selectedCategory === DEFAULT_CATEGORY
      ? "products"
      : selectedCategory.toLowerCase();

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
      >
        <p className="text-gray-500 mb-4">
          No {productTypeText} found
        </p>
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClearAllFilters}
            className="text-gray-900 underline hover:no-underline"
        >
          Clear filters
        </motion.button>
      </motion.div>
  );
}

function ErrorMessage({ errorText, onRetryClick }) {
  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg">Error: {errorText}</p>
          <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetryClick}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
  );
}

// Main component
function StorePage() {
  const vehicleStore = useVehicleStore();
  const accessoryStore = useAccessoryStore();
  const [currentPageProducts, setCurrentPageProducts] = useState([]);

  // Comparison state and functions
  const [comparisonVehicles, setComparisonVehicles] = useState([]);
  const MAX_COMPARISON_VEHICLES = 4;

  const addToComparison = (vehicle) => {
    // Check if vehicle is already in comparison
    if (comparisonVehicles.some(v => v.id === vehicle.id)) {
      // Remove if already in comparison
      removeFromComparison(vehicle.id);
      return;
    }

    // Check if we've reached the maximum
    if (comparisonVehicles.length >= MAX_COMPARISON_VEHICLES) {
      toast.warning(`You can only compare up to ${MAX_COMPARISON_VEHICLES} vehicles`);
      return;
    }

    setComparisonVehicles(prev => [...prev, vehicle]);
    toast.success("Vehicle added to comparison");
  };

  const removeFromComparison = (vehicleId) => {
    setComparisonVehicles(prev => prev.filter(v => v.id !== vehicleId));
    toast.success("Vehicle removed from comparison");
  };

  const clearComparison = () => {
    setComparisonVehicles([]);
    toast.success("Comparison cleared");
  };

  const isInComparison = (vehicleId) => {
    return comparisonVehicles.some(v => v.id === vehicleId);
  };

  const isComparisonFull = () => {
    return comparisonVehicles.length >= MAX_COMPARISON_VEHICLES;
  };

  const {
    searchTerm,
    selectedCategory,
    sortOrder,
    brandFilter,
    bodyTypeFilter,
    yearFilter,
    accidentHistoryFilter,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    filteredProducts,
    hasActiveFilters,
    vehicleFilters,
    setSearchTerm,
    setSelectedCategory,
    setSortOrder,
    setBrandFilter,
    setBodyTypeFilter,
    setYearFilter,
    setAccidentHistoryFilter,
    setMinPrice,
    setMaxPrice,
    setMinMileage,
    setMaxMileage,
    clearAllFilters
  } = useBackendFiltering(accessoryStore);

  // Check if vehicle-specific filters should be shown
  const isVehicleCategory = selectedCategory === "All" || selectedCategory === "Vehicles" ||
      selectedCategory === "Hot Deal Vehicles" || selectedCategory === "Hot Deals";

  // Fetch data using smart endpoint selection
  useEffect(() => {
    async function fetchFilteredData() {
      try {
        // Check if we have any backend filter parameters
        const hasBackendFilters = (
            vehicleFilters.brandFilter !== DEFAULT_BRAND_FILTER ||
            vehicleFilters.bodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER ||
            vehicleFilters.yearFilter !== DEFAULT_YEAR_FILTER ||
            vehicleFilters.accidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER ||
            vehicleFilters.minPrice !== DEFAULT_MIN_PRICE ||
            vehicleFilters.maxPrice !== DEFAULT_MAX_PRICE ||
            vehicleFilters.minMileage !== DEFAULT_MIN_MILEAGE ||
            vehicleFilters.maxMileage !== DEFAULT_MAX_MILEAGE
        );

        if (hasBackendFilters) {
          // Use filter endpoint when we have actual filters
          const filterParams = buildVehicleFilterParameters(vehicleFilters, sortOrder);
          // Add a large page size to get all results
          filterParams.size = 1000; // Large number to get all results
          await vehicleStore.filterVehicles(filterParams);
        } else {
          // Use original endpoints when no filters (your working approach)
          await vehicleStore.getAvailableVehicles();
        }

        // Always fetch all accessories (they'll be filtered on frontend)
        await accessoryStore.getAllAccessories();
      } catch (error) {
        console.error("Failed to fetch filtered data:", error);
      }
    }

    fetchFilteredData();
  }, [vehicleFilters, sortOrder]);

  // Handle adding products to cart
  function addVehicleToCart(vehicle) {
    handleAddToCart({
      product: vehicle,
      type: "VEHICLE"
    });
  }

  function addAccessoryToCart(accessory, quantity = 1) {
    handleAddToCart({
      product: accessory,
      type: "ACCESSORY",
      quantity
    });
  }

  // Handle retry when there's an error
  async function retryDataFetch() {
    try {
      // Check if we have any backend filter parameters
      const hasBackendFilters = (
          vehicleFilters.brandFilter !== DEFAULT_BRAND_FILTER ||
          vehicleFilters.bodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER ||
          vehicleFilters.yearFilter !== DEFAULT_YEAR_FILTER ||
          vehicleFilters.accidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER ||
          vehicleFilters.minPrice !== DEFAULT_MIN_PRICE ||
          vehicleFilters.maxPrice !== DEFAULT_MAX_PRICE ||
          vehicleFilters.minMileage !== DEFAULT_MIN_MILEAGE ||
          vehicleFilters.maxMileage !== DEFAULT_MAX_MILEAGE
      );

      if (hasBackendFilters) {
        const filterParams = buildVehicleFilterParameters(vehicleFilters, sortOrder);
        filterParams.size = 1000; // Large number to get all results
        await vehicleStore.filterVehicles(filterParams);
      } else {
        await vehicleStore.getAvailableVehicles();
      }

      await accessoryStore.getAllAccessories();
    } catch (error) {
      console.error("Retry failed:", error);
    }
  }

  const isCurrentlyLoading = vehicleStore.loading || accessoryStore.loading;
  const currentError = vehicleStore.error || accessoryStore.error;

  // Show error state if there's an error
  if (currentError) {
    return (
        <ErrorMessage
            errorText={currentError}
            onRetryClick={retryDataFetch}
        />
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen mt-6 py-8 px-4 max-w-7xl mx-auto"
      >
        {/* Page title */}
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl mb-12 text-center font-bold text-gray-900"
        >
          Store
        </motion.h1>

        {/* Primary filter and search controls */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 mb-6 justify-center"
        >
          <SearchBar
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search vehicles and accessories..."
          />
          <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChangeCategory={setSelectedCategory}
          />
          <SortDropDown
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              options={SORT_OPTIONS}
          />
        </motion.div>

        {/* Vehicle-specific filters - only show for vehicle categories */}
        {isVehicleCategory && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 mb-6 justify-center"
            >
              <FilterDropdown
                  label="Brand"
                  value={brandFilter}
                  onChange={setBrandFilter}
                  options={VEHICLE_BRANDS}
              />
              <FilterDropdown
                  label="Body Type"
                  value={bodyTypeFilter}
                  onChange={setBodyTypeFilter}
                  options={VEHICLE_BODY_TYPES}
              />
              <FilterDropdown
                  label="Model Year"
                  value={yearFilter}
                  onChange={setYearFilter}
                  options={MODEL_YEARS}
              />
              <FilterDropdown
                  label="Accident History"
                  value={accidentHistoryFilter}
                  onChange={setAccidentHistoryFilter}
                  options={ACCIDENT_HISTORY_OPTIONS}
              />
            </motion.div>
        )}

        {/* Price and Mileage range filters - only show for vehicle categories */}
        {isVehicleCategory && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8 justify-center"
            >
              <FilterInput
                  label="Min Price ($)"
                  value={minPrice}
                  onChange={setMinPrice}
                  placeholder="0"
              />
              <FilterInput
                  label="Max Price ($)"
                  value={maxPrice}
                  onChange={setMaxPrice}
                  placeholder="100000"
              />
              <FilterInput
                  label="Min Mileage"
                  value={minMileage}
                  onChange={setMinMileage}
                  placeholder="0"
              />
              <FilterInput
                  label="Max Mileage"
                  value={maxMileage}
                  onChange={setMaxMileage}
                  placeholder="200000"
              />
            </motion.div>
        )}

        {/* Active filters display */}
        <AnimatePresence>
          {hasActiveFilters && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
              >
                <div className="rounded-lg p-4 flex flex-wrap items-center gap-2 text-sm">
                  {searchTerm && (
                      <ActiveFilterTag onRemoveFilter={() => setSearchTerm(DEFAULT_SEARCH_TERM)}>
                        "{searchTerm}"
                      </ActiveFilterTag>
                  )}
                  {selectedCategory !== DEFAULT_CATEGORY && (
                      <ActiveFilterTag onRemoveFilter={() => setSelectedCategory(DEFAULT_CATEGORY)}>
                        {selectedCategory}
                      </ActiveFilterTag>
                  )}
                  {brandFilter !== DEFAULT_BRAND_FILTER && (
                      <ActiveFilterTag onRemoveFilter={() => setBrandFilter(DEFAULT_BRAND_FILTER)}>
                        {VEHICLE_BRANDS.find(b => b.value === brandFilter)?.label}
                      </ActiveFilterTag>
                  )}
                  {bodyTypeFilter !== DEFAULT_BODY_TYPE_FILTER && (
                      <ActiveFilterTag onRemoveFilter={() => setBodyTypeFilter(DEFAULT_BODY_TYPE_FILTER)}>
                        {VEHICLE_BODY_TYPES.find(b => b.value === bodyTypeFilter)?.label}
                      </ActiveFilterTag>
                  )}
                  {yearFilter !== DEFAULT_YEAR_FILTER && (
                      <ActiveFilterTag onRemoveFilter={() => setYearFilter(DEFAULT_YEAR_FILTER)}>
                        {MODEL_YEARS.find(y => y.value === yearFilter)?.label}
                      </ActiveFilterTag>
                  )}
                  {accidentHistoryFilter !== DEFAULT_ACCIDENT_HISTORY_FILTER && (
                      <ActiveFilterTag onRemoveFilter={() => setAccidentHistoryFilter(DEFAULT_ACCIDENT_HISTORY_FILTER)}>
                        {ACCIDENT_HISTORY_OPTIONS.find(a => a.value === accidentHistoryFilter)?.label}
                      </ActiveFilterTag>
                  )}
                  {minPrice && (
                      <ActiveFilterTag onRemoveFilter={() => setMinPrice(DEFAULT_MIN_PRICE)}>
                        Min: ${minPrice}
                      </ActiveFilterTag>
                  )}
                  {maxPrice && (
                      <ActiveFilterTag onRemoveFilter={() => setMaxPrice(DEFAULT_MAX_PRICE)}>
                        Max: ${maxPrice}
                      </ActiveFilterTag>
                  )}
                  {minMileage && (
                      <ActiveFilterTag onRemoveFilter={() => setMinMileage(DEFAULT_MIN_MILEAGE)}>
                        Min Miles: {minMileage}
                      </ActiveFilterTag>
                  )}
                  {maxMileage && (
                      <ActiveFilterTag onRemoveFilter={() => setMaxMileage(DEFAULT_MAX_MILEAGE)}>
                        Max Miles: {maxMileage}
                      </ActiveFilterTag>
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

        {/* Main content area */}
        {isCurrentlyLoading ? (
            <LoadingSpinner />
        ) : filteredProducts.length === 0 ? (
            <EmptyProductsMessage
                selectedCategory={selectedCategory}
                onClearAllFilters={clearAllFilters}
            />
        ) : (
            <>
              {/* Product grid */}
              <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                <AnimatePresence>
                  {currentPageProducts.map((product) => (
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
                                onAddToCart={() => addVehicleToCart(product)}
                                onAddToComparison={addToComparison}
                                isInComparison={isInComparison(product.id)}
                                isComparisonFull={isComparisonFull()}
                            />
                        ) : (
                            <AccessoryCard
                                accessory={product}
                                onAddToCart={addAccessoryToCart}
                            />
                        )}
                      </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination controls */}
              <Pagination
                  items={filteredProducts}
                  pageLimit={PRODUCTS_PER_PAGE}
                  setPageItems={setCurrentPageProducts}
              />
            </>
        )}

        {/* Floating Comparison Component */}
        <FloatingComparison
            comparisonVehicles={comparisonVehicles}
            onRemoveVehicle={removeFromComparison}
            onClearAll={clearComparison}
        />
      </motion.div>
  );
}

export default StorePage;