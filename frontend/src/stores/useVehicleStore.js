import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

export const useVehicleStore = create((set) => ({
    vehicles: [],
    currentVehicle: null, // For individual vehicle pages
    loading: false,
    error: null,

    // Set vehicles directly
    setVehicles: (vehicles) => set({ vehicles }),

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current vehicle
    clearCurrentVehicle: () => set({ currentVehicle: null }),

    // Create vehicle
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
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to create vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Get all vehicles
    getAllVehicles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/vehicle/all");
            set({
                vehicles: response.data,
                loading: false
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to fetch vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Get vehicle by ID
    getVehicleById: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/vehicle/${vehicleId}`);
            set({
                currentVehicle: response.data,
                loading: false
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to fetch vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Update vehicle
    updateVehicle: async (vehicleId, vehicleData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/vehicle/${vehicleId}`, vehicleData);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle.id === vehicleId ? response.data : vehicle
                ),
                // Update currentVehicle if it's the same vehicle
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? response.data : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Vehicle updated successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to update vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Delete vehicle
    deleteVehicle: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/vehicle/${vehicleId}`);
            set((prevState) => ({
                vehicles: prevState.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
                // Clear currentVehicle if it was the deleted vehicle
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? null : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Vehicle deleted successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to delete vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Get available vehicles
    getAvailableVehicles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/vehicle/available");
            set({
                vehicles: response.data,
                loading: false
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to fetch available vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Get vehicles by status
    getVehiclesByStatus: async (statuses) => {
        set({ loading: true, error: null });
        try {
            const statusParams = statuses.map(status => `statuses=${status}`).join('&');
            const response = await axios.get(`/api/v1/vehicle/by-status?${statusParams}`);
            set({
                vehicles: response.data,
                loading: false
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to fetch vehicles by status";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Filter vehicles (server-side)
    filterVehicles: async (filters = {}, pageOptions = { page: 0, size: 10, sort: [] }) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();

            // Add filter parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            // Add pagination parameters
            params.append('page', pageOptions.page);
            params.append('size', pageOptions.size);

            // Add sorting if provided
            if (pageOptions.sort && pageOptions.sort.length > 0) {
                pageOptions.sort.forEach(sortParam => {
                    params.append('sort', sortParam);
                });
            }

            const response = await axios.get(`/api/v1/vehicle/filter?${params.toString()}`);

            set({ loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to filter vehicles";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Add image URLs to vehicle
    addImageUrls: async (vehicleId, imageUrls) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/vehicle/${vehicleId}/images`, imageUrls);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle.id === vehicleId ? response.data : vehicle
                ),
                // Update currentVehicle if it's the same vehicle
                currentVehicle: prevState.currentVehicle?.id === vehicleId ? response.data : prevState.currentVehicle,
                loading: false,
            }));
            toast.success("Image URLs added successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to add image URLs";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },
}));