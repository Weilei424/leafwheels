import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "./useUserStore";

// Helper function to get auth headers for authenticated operations
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const useAccessoryStore = create((set, get) => ({
    // State
    accessories: [],
    currentAccessory: null,
    loading: false,
    error: null,

    // Clear functions
    clearError: () => set({ error: null }),
    clearCurrentAccessory: () => set({ currentAccessory: null }),

    // ================= ACCESSORY CRUD =================

    // PUBLIC - No auth required
    getAllAccessories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/accessories/all");
            set({ accessories: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch accessories";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // PUBLIC - No auth required
    getAccessoryById: async (accessoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/accessories/${accessoryId}`);
            set({ currentAccessory: response.data, loading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch accessory";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // REQUIRES AUTH - POST operation
    createAccessory: async (accessoryData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/accessories", accessoryData, {
                headers: getAuthHeaders()
            });
            set((prevState) => ({
                accessories: [...prevState.accessories, response.data],
                loading: false,
            }));
            toast.success("Accessory created successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create accessory";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },


    updateAccessory: async (accessoryId, accessoryData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/api/v1/accessories/${accessoryId}`, accessoryData, {
                headers: getAuthHeaders()
            });
            set((prevState) => ({
                accessories: prevState.accessories.map((accessory) =>
                    accessory.id === accessoryId ? response.data : accessory
                ),
                currentAccessory: prevState.currentAccessory?.id === accessoryId ? response.data : prevState.currentAccessory,
                loading: false,
            }));
            toast.success("Accessory updated successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update accessory";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // REQUIRES AUTH - DELETE operation
    deleteAccessory: async (accessoryId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/accessories/${accessoryId}`, {
                headers: getAuthHeaders()
            });
            set((prevState) => ({
                accessories: prevState.accessories.filter((accessory) => accessory.id !== accessoryId),
                currentAccessory: prevState.currentAccessory?.id === accessoryId ? null : prevState.currentAccessory,
                loading: false,
            }));
            toast.success("Accessory deleted successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete accessory";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // REQUIRES AUTH - POST operation
    addImageUrls: async (accessoryId, imageUrls) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/accessories/${accessoryId}/images`, imageUrls, {
                headers: getAuthHeaders()
            });
            set((prevState) => ({
                accessories: prevState.accessories.map((accessory) =>
                    accessory.id === accessoryId ? response.data : accessory
                ),
                currentAccessory: prevState.currentAccessory?.id === accessoryId ? response.data : prevState.currentAccessory,
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
}));