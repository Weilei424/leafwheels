import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "./useUserStore";

// Auth headers helper
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Filter query builder
const buildFilterQueryString = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && value !== 'all') {
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
    vehicles: [],
    currentVehicle: null,
    currentVehicleHistory: [],
    loading: false,
    historyLoading: false,
    error: null,

    clearError: () => set({ error: null }),
    clearCurrentVehicle: () => set({ currentVehicle: null }),

    // ===== Utilities =====
    setLoading: (key, value) => set({ [key]: value, error: null }),

    handleError: (key, error) => {
        const message = error?.response?.data?.message || "Something went wrong";
        set({ [key]: false, error: message });
        toast.error(message);
        throw error;
    },

    // ===== Vehicle APIs =====
    getAllVehicles: async () => {
        get().setLoading("loading", true);
        try {
            const res = await axios.get("/api/v1/vehicle/all");
            set({ vehicles: res.data, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    getAvailableVehicles: async () => {
        get().setLoading("loading", true);
        try {
            const res = await axios.get("/api/v1/vehicle/available");
            set({ vehicles: res.data, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    getVehicleById: async (id) => {
        get().setLoading("loading", true);
        try {
            const res = await axios.get(`/api/v1/vehicle/${id}`);
            set({ currentVehicle: res.data, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    getVehiclesByStatus: async (statuses) => {
        get().setLoading("loading", true);
        try {
            const query = statuses.map(s => `statuses=${s}`).join("&");
            const res = await axios.get(`/api/v1/vehicle/by-status?${query}`);
            set({ vehicles: res.data, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    getVehiclesExcludingStatus: async (statuses) => {
        get().setLoading("loading", true);
        try {
            const query = statuses.map(s => `excludedStatuses=${s}`).join("&");
            const res = await axios.get(`/api/v1/vehicle/excluding-status?${query}`);
            set({ vehicles: res.data, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    filterVehicles: async (filters = {}) => {
        get().setLoading("loading", true);
        try {
            const query = buildFilterQueryString(filters);
            const url = query ? `/api/v1/vehicle/filter?${query}` : "/api/v1/vehicle/filter";
            const res = await axios.get(url);
            const vehicles = res.data.content || res.data;
            set({ vehicles, loading: false });
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    createVehicle: async (data) => {
        get().setLoading("loading", true);
        try {
            const res = await axios.post("/api/v1/vehicle", data, {
                headers: getAuthHeaders()
            });
            set(prev => ({
                vehicles: [...prev.vehicles, res.data],
                loading: false
            }));
            toast.success("Vehicle created successfully!");
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    updateVehicle: async (id, data) => {
        get().setLoading("loading", true);
        try {
            const res = await axios.put(`/api/v1/vehicle/${id}`, data, {
                headers: getAuthHeaders()
            });
            set(prev => ({
                vehicles: prev.vehicles.map(v => v.id === id ? res.data : v),
                currentVehicle: prev.currentVehicle?.id === id ? res.data : prev.currentVehicle,
                loading: false
            }));
            toast.success("Vehicle updated successfully!");
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    deleteVehicle: async (id) => {
        get().setLoading("loading", true);
        try {
            await axios.delete(`/api/v1/vehicle/${id}`, {
                headers: getAuthHeaders()
            });
            set(prev => ({
                vehicles: prev.vehicles.filter(v => v.id !== id),
                currentVehicle: prev.currentVehicle?.id === id ? null : prev.currentVehicle,
                loading: false
            }));
            toast.success("Vehicle deleted successfully!");
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    addImageUrls: async (id, imageUrls) => {
        get().setLoading("loading", true);
        try {
            const res = await axios.post(`/api/v1/vehicle/${id}/images`, imageUrls, {
                headers: getAuthHeaders()
            });
            set(prev => ({
                vehicles: prev.vehicles.map(v => v.id === id ? res.data : v),
                currentVehicle: prev.currentVehicle?.id === id ? res.data : prev.currentVehicle,
                loading: false
            }));
            toast.success("Image URLs added successfully!");
            return res.data;
        } catch (err) {
            get().handleError("loading", err);
        }
    },

    // ===== Vehicle History APIs =====
    getVehicleHistoryByVehicleId: async (id) => {
        get().setLoading("historyLoading", true);
        try {
            const res = await axios.get(`/api/v1/vehiclehistory/vehicle/${id}`);
            set({ currentVehicleHistory: res.data, historyLoading: false });
            return res.data;
        } catch (err) {
            get().handleError("historyLoading", err);
        }
    },

    getHistoryRecordById: async (historyId) => {
        get().setLoading("historyLoading", true);
        try {
            const res = await axios.get(`/api/v1/vehiclehistory/${historyId}`);
            set({ historyLoading: false });
            return res.data;
        } catch (err) {
            get().handleError("historyLoading", err);
        }
    },

    createVehicleHistory: async (data) => {
        get().setLoading("historyLoading", true);
        try {
            const res = await axios.post("/api/v1/vehiclehistory", data, {
                headers: getAuthHeaders()
            });
            set({ historyLoading: false });
            toast.success("Vehicle history record created successfully!");
            return res.data;
        } catch (err) {
            get().handleError("historyLoading", err);
        }
    },

    updateVehicleHistory: async (id, data) => {
        get().setLoading("historyLoading", true);
        try {
            const res = await axios.put(`/api/v1/vehiclehistory/${id}`, data, {
                headers: getAuthHeaders()
            });
            set({ historyLoading: false });
            toast.success("Vehicle history updated successfully!");
            return res.data;
        } catch (err) {
            get().handleError("historyLoading", err);
        }
    },

    deleteVehicleHistory: async (id) => {
        get().setLoading("historyLoading", true);
        try {
            await axios.delete(`/api/v1/vehiclehistory/${id}`, {
                headers: getAuthHeaders()
            });
            set({ historyLoading: false });
            toast.success("Vehicle history deleted successfully!");
        } catch (err) {
            get().handleError("historyLoading", err);
        }
    },
}));
