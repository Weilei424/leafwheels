import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

export const useVehicleStore = create((set, get) => ({
    // State
    vehicles: [],
    currentVehicle: null,
    currentVehicleHistory: [],
    loading: false,
    historyLoading: false,
    error: null,

    // Clear functions
    clearError: () => set({ error: null }),
    clearCurrentVehicle: () => set({ currentVehicle: null }),

    // ================= VEHICLE CRUD =================

    getAllVehicles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/vehicle/all");
            set({ vehicles: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    getVehicleById: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/vehicle/${vehicleId}`);
            set({ currentVehicle: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    createVehicle: async (vehicleData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/vehicle", vehicleData);
            set((prevState) => ({
                vehicles: [...prevState.vehicles, response.data],
                loading: false,
            }));
            toast.success("Vehicle created successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    updateVehicle: async (vehicleId, vehicleData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/vehicle/${vehicleId}`, vehicleData);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle.id === vehicleId ? response.data : vehicle
                ),
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? response.data : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Vehicle updated successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    deleteVehicle: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/vehicle/${vehicleId}`);
            set((prevState) => ({
                vehicles: prevState.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? null : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Vehicle deleted successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    getAvailableVehicles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/vehicle/available");
            set({ vehicles: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch available vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    getVehiclesByStatus: async (statuses) => {
        set({ loading: true, error: null });
        try {
            const statusParams = statuses.map(status => `statuses=${status}`).join('&');
            const response = await axios.get(`/api/v1/vehicle/by-status?${statusParams}`);
            set({ vehicles: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch vehicles by status";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    getVehiclesExcludingStatus: async (excludedStatuses) => {
        set({ loading: true, error: null });
        try {
            const statusParams = excludedStatuses.map(status => `excludedStatuses=${status}`).join('&');
            const response = await axios.get(`/api/v1/vehicle/excluding-status?${statusParams}`);
            set({ vehicles: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch vehicles excluding status";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    addImageUrls: async (vehicleId, imageUrls) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/vehicle/${vehicleId}/images`, imageUrls);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle.id === vehicleId ? response.data : vehicle
                ),
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? response.data : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Image URLs added successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add image URLs";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },


    filterVehicles: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();

            // Add all filter parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`/api/v1/vehicle/filter?${params.toString()}`);
            set({ vehicles: response.data.content || response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to filter vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // ================= VEHICLE HISTORY =================

    getVehicleHistoryByVehicleId: async (vehicleId) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/vehiclehistory/vehicle/${vehicleId}`);
            set({ currentVehicleHistory: response.data, historyLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch vehicle history";
            set({ error: errorMessage, historyLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    getHistoryRecordById: async (vehicleHistoryId) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/vehiclehistory/${vehicleHistoryId}`);
            set({ historyLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch history record";
            set({ error: errorMessage, historyLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    createVehicleHistory: async (vehicleHistoryData) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.post("/api/v1/vehiclehistory", vehicleHistoryData);
            set({ historyLoading: false });
            toast.success("Vehicle history record created successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create vehicle history";
            set({ error: errorMessage, historyLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    updateVehicleHistory: async (vehicleHistoryId, vehicleHistoryData) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/vehiclehistory/${vehicleHistoryId}`, vehicleHistoryData);
            set({ historyLoading: false });
            toast.success("Vehicle history updated successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update vehicle history";
            set({ error: errorMessage, historyLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    deleteVehicleHistory: async (vehicleHistoryId) => {
        set({ historyLoading: true, error: null });
        try {
            await axios.delete(`/api/v1/vehiclehistory/${vehicleHistoryId}`);
            set({ historyLoading: false });
            toast.success("Vehicle history deleted successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete vehicle history";
            set({ error: errorMessage, historyLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },
}));