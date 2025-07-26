import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

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

    createAccessory: async (accessoryData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/accessories", accessoryData);
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
            const response = await axios.put(`/api/v1/accessories/${accessoryId}`, accessoryData);
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

    deleteAccessory: async (accessoryId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/accessories/${accessoryId}`);
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

    addImageUrls: async (accessoryId, imageUrls) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`/api/v1/accessories/${accessoryId}/images`, imageUrls);
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