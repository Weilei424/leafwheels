import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "./useUserStore";

// Helper function to get auth headers for authenticated operations
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Helper function to build filter query parameters
const buildFilterQueryString = (filters) => {
    const params = new URLSearchParams();

    // Add all filter parameters, only if they have values
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && value !== 'all') {
            // Handle array parameters (like statuses)
            if (Array.isArray(value)) {
                value.forEach(item => params.append(key, item));
            } else {
                params.append(key, value);
            }
        }
    });

    return params.toString();
};

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

    // PUBLIC - No auth required
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

    // PUBLIC - No auth required
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

    // REQUIRES AUTH - POST operation
    createVehicle: async (vehicleData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/vehicle", vehicleData, {
                headers: getAuthHeaders()
            });
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

    // REQUIRES AUTH - PUT operation
    updateVehicle: async (vehicleId, vehicleData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/vehicle/${vehicleId}`, vehicleData, {
                headers: getAuthHeaders()
            });
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

    // REQUIRES AUTH - DELETE operation
    deleteVehicle: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/vehicle/${vehicleId}`, {
                headers: getAuthHeaders()
            });
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

    // PUBLIC - No auth required
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

    // PUBLIC - No auth required
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

    // PUBLIC - No auth required
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

    // REQUIRES AUTH - POST operation
    addImageUrls: async (vehicleId, imageUrls) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/vehicle/${vehicleId}/images`, imageUrls, {
                headers: getAuthHeaders()
            });
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

    // PUBLIC - Enhanced backend filtering - No auth required
    filterVehicles: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            // Build query string from filters
            const queryString = buildFilterQueryString(filters);
            const url = queryString ? `/api/v1/vehicle/filter?${queryString}` : '/api/v1/vehicle/filter';

            console.log('Filtering vehicles with URL:', url); // Debug log

            const response = await axios.get(url);

            // Handle both paginated and non-paginated responses
            const vehicleData = response.data.content || response.data;

            set({ vehicles: vehicleData, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to filter vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },


    // ================= VEHICLE HISTORY =================

    // PUBLIC - No auth required
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

    // PUBLIC - No auth required
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

    // REQUIRES AUTH - POST operation
    createVehicleHistory: async (vehicleHistoryData) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.post("/api/v1/vehiclehistory", vehicleHistoryData, {
                headers: getAuthHeaders()
            });
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

    // REQUIRES AUTH - PUT operation
    updateVehicleHistory: async (vehicleHistoryId, vehicleHistoryData) => {
        set({ historyLoading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/vehiclehistory/${vehicleHistoryId}`, vehicleHistoryData, {
                headers: getAuthHeaders()
            });
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

    // REQUIRES AUTH - DELETE operation
    deleteVehicleHistory: async (vehicleHistoryId) => {
        set({ historyLoading: true, error: null });
        try {
            await axios.delete(`/api/v1/vehiclehistory/${vehicleHistoryId}`, {
                headers: getAuthHeaders()
            });
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