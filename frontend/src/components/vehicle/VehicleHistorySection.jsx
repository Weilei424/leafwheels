import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useVehicleStore } from "../../stores/useVehicleStore.js";

const VehicleHistorySection = ({ vehicleId }) => {
    const {
        currentVehicleHistory,
        getVehicleHistoryByVehicleId,
        historyLoading
    } = useVehicleStore();

    useEffect(() => {
        if (vehicleId) {
            getVehicleHistoryByVehicleId(vehicleId);
        }
    }, [vehicleId, getVehicleHistoryByVehicleId]);

    if (historyLoading) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Vehicle History</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-center py-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full"
                        />
                        <span className="ml-3 text-gray-600">Loading history...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentVehicleHistory || currentVehicleHistory.length === 0) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Vehicle History</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-center py-8">
                        <span className="text-4xl mb-4 block">📋</span>
                        <p className="text-gray-600">No history records available for this vehicle.</p>
                        <p className="text-sm text-green-600 mt-2">✓ Clean history report</p>
                    </div>
                </div>
            </div>
        );
    }

    // Count accidents (records with accidentDate)
    const accidentCount = currentVehicleHistory.filter(h => h.accidentDate).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-900">Vehicle History</h2>

                {/* Simple Summary */}
                <div className="text-sm">
                    {accidentCount > 0 ? (
                        <span className="text-red-600 font-medium">
                            ⚠️ {accidentCount} Accident{accidentCount > 1 ? 's' : ''}
                        </span>
                    ) : (
                        <span className="text-green-600 font-medium">
                            ✓ No Accidents
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {currentVehicleHistory.map((record, index) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* Simple Icon */}
                                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-lg">
                                    ⚠️
                                </div>

                                {/* Event Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-900">ACCIDENT</h3>
                                        <div className="text-sm text-gray-500">
                                            {new Date(record.accidentDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                        {record.accidentDescription}
                                    </p>

                                    <div className="text-xs text-gray-500">
                                        💰 ${record.repairCost?.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4">
                    <p className="text-xs text-gray-500 text-center">
                        History records: {currentVehicleHistory.length} total •
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default VehicleHistorySection;