import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { handleAddToCart } from "../../hooks/handleAddToCart.js";

const FloatingComparison = ({ comparisonVehicles, onRemoveVehicle, onClearAll }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetailedComparison, setShowDetailedComparison] = useState(false);

    if (comparisonVehicles.length === 0) {
        return null;
    }

    return (
        <>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200"
            >
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-50">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >

                        <span className="font-medium">
                            Compare Vehicles ({comparisonVehicles.length})
                        </span>
                        <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm"
                        >
                            ▲
                        </motion.span>
                    </motion.button>

                    <div className="flex items-center gap-2">
                        {comparisonVehicles.length >= 2 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowDetailedComparison(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                Compare Now
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClearAll}
                            className="p-2"
                            title="Clear all vehicles"
                        >
                            <img src="delete.png" alt="Remove" className="h-5 w-7" />
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-gray-100"
                        >
                            <div className="px-4 py-2 ">
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {comparisonVehicles.map((vehicle) => (
                                        <ComparisonVehicleCard
                                            key={vehicle.id}
                                            vehicle={vehicle}
                                            onRemove={() => onRemoveVehicle(vehicle.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {showDetailedComparison && (
                    <DetailedComparisonModal
                        vehicles={comparisonVehicles}
                        onClose={() => setShowDetailedComparison(false)}
                        onRemoveVehicle={onRemoveVehicle}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

const ComparisonVehicleCard = ({ vehicle, onRemove }) => {
    const originalPrice = Number(vehicle.price || 0);
    const discountPercent = Number(vehicle.discountPercentage || 0);
    const isOnDeal = vehicle.onDeal && discountPercent > 0;
    const finalPrice = isOnDeal
        ? originalPrice * (1 - discountPercent)
        : originalPrice;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="min-w-[240px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative"
        >
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRemove}
                className="absolute top-2 right-2 w-7 h-5 "

            >
                <img
                    src="delete.png"
                    alt="Remove"
                />

            </motion.button>


            {isOnDeal && (
                <div className="absolute top-2 left-2  bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full z-10">
                    {Math.round(discountPercent * 100)}% OFF
                </div>
            )}

            <div className="p-6 space-y-6 mt-2">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>

                <div className="text-sm font-semibold text-gray-900">
                    ${finalPrice.toLocaleString()}
                    {isOnDeal && (
                        <span className="ml-1 text-xs text-gray-400 line-through">
                            ${originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="block w-full py-2 px-3 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

const DetailedComparisonModal = ({ vehicles, onClose, onRemoveVehicle }) => {
    const columnWidth = `${100 / (vehicles.length + 1)}%`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Vehicle Comparison</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        ✕
                    </motion.button>
                </div>

                <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead>
                            <tr className="border-b border-gray-100">
                                <td className="p-4  font-medium text-gray-900" style={{ width: columnWidth }}>
                                    Vehicle
                                </td>
                                {vehicles.map((vehicle) => (
                                    <VehicleColumnHeader
                                        key={vehicle.id}
                                        vehicle={vehicle}
                                        onRemove={onRemoveVehicle}
                                        width={columnWidth}
                                    />
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            <ComparisonRow
                                label="Price"
                                values={vehicles.map(vehicle => {
                                    const originalPrice = Number(vehicle.price || 0);
                                    const discountPercent = Number(vehicle.discountPercentage || 0);
                                    const isOnDeal = vehicle.onDeal && discountPercent > 0;
                                    const finalPrice = isOnDeal ? originalPrice * (1 - discountPercent) : originalPrice;

                                    return (
                                        <div key={vehicle.id}>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    ${finalPrice.toLocaleString()}
                                                </span>
                                            {isOnDeal && (
                                                <>
                                                        <span className="ml-2 text-sm text-gray-400 line-through">
                                                            ${originalPrice.toLocaleString()}
                                                        </span>
                                                    <div className="text-xs text-red-600 font-medium mt-1">
                                                        {Math.round(discountPercent * 100)}% OFF
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                                columnWidth={columnWidth}
                            />

                            <ComparisonRow
                                label="Status"
                                values={vehicles.map(v => (
                                    <span key={v.id} className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(v.status)}`}>
                                            {v.status}
                                        </span>
                                ))}
                                columnWidth={columnWidth}
                            />
                            <ComparisonRow label="Year" values={vehicles.map(v => v.year)} columnWidth={columnWidth} />
                            <ComparisonRow label="Body Type" values={vehicles.map(v => v.bodyType)} columnWidth={columnWidth} />
                            <ComparisonRow label="Color" values={vehicles.map(v => v.exteriorColor)} columnWidth={columnWidth} />
                            <ComparisonRow label="Doors" values={vehicles.map(v => v.doors)} columnWidth={columnWidth} />
                            <ComparisonRow label="Seats" values={vehicles.map(v => v.seats)} columnWidth={columnWidth} />
                            <ComparisonRow
                                label="Mileage"
                                values={vehicles.map(v => `${v.mileage.toLocaleString()} km`)}
                                columnWidth={columnWidth}
                            />
                            <ComparisonRow label="Condition" values={vehicles.map(v => v.condition)} columnWidth={columnWidth} />
                            <ComparisonRow
                                label="Battery Range"
                                values={vehicles.map(v => `${v.batteryRange} km`)}
                                columnWidth={columnWidth}
                            />

                            <tr className="border-t-2 border-gray-100">
                                <td className="p-4 font-medium text-gray-900" style={{ width: columnWidth }}>
                                    Actions
                                </td>
                                {vehicles.map((vehicle) => (
                                    <td key={vehicle.id} className="p-4" style={{ width: columnWidth }}>
                                        <div className="space-y-2 flex flex-col">
                                            <Link
                                                to={`/vehicle/${vehicle.id}`}
                                                onClick={onClose}
                                                className="block w-full py-2 px-4 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                            >
                                                View Details
                                            </Link>

                                            {(vehicle.status === "AVAILABLE" || vehicle.status === "DEMO") && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAddToCart({ product: vehicle, type: "VEHICLE" })}
                                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                >
                                                    Add to Cart
                                                </motion.button>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const VehicleColumnHeader = ({ vehicle, onRemove, width }) => {
    return (
        <td className="p-4 text-center border-l border-gray-100" style={{ width }}>
            <div className="space-y-4">
                <div className="flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemove(vehicle.id)}
                        className="w-8 h-6 hover:opacity-80 transition-opacity"
                    >
                        <img src="delete.png" alt="Remove" className="h-full w-full object-contain" />
                    </motion.button>
                </div>

                <div className="px-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{vehicle.trim}</p>
                </div>
            </div>
        </td>
    );
};

const ComparisonRow = ({ label, values, columnWidth }) => {
    return (
        <tr className="border-b border-gray-50 hover:bg-gray-25">
            <td className="py-4 px-4 font-medium text-gray-700 bg-gray" style={{ width: columnWidth }}>
                {label}
            </td>
            {values.map((value, index) => (
                <td key={index} className="py-2 px-3 text-center border-l border-gray-100" style={{ width: columnWidth }}>
                    {value}
                </td>
            ))}
        </tr>
    );
};

const getStatusStyle = (status) => {
    const styles = {
        AVAILABLE: "bg-green-100 text-green-700",
        SOLD: "bg-red-100 text-red-700",
        DEMO: "bg-blue-100 text-blue-700",
        PENDING: "bg-amber-100 text-amber-700",
        INCOMING: "bg-purple-100 text-purple-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
};

export default FloatingComparison;
