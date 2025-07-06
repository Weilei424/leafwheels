import { create } from "zustand";
import { toast } from "react-toastify"; // Toast notifications.
import axios from "../lib/axios";

export const useVehicleStore = create((set) => ({
    vehicles: [],
    loading: false,

    setVehicles: (vehicles) => set({ vehicles }),
    createVehicle: async (vehicleData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/api/v1/vehicle", vehicleData);
            set((prevState) => ({
                vehicles: [...prevState.vehicles, res.data],
                loading: false,
            }));
        } catch (error) {
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },
    getAllVehicles: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/api/v1/vehicle/all");
            set({ vehicles: response.data.vehicles, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch vehicles", loading: false });
            toast.error(error.response.data.error || "Failed to fetch vehicles");
        }
    },

    // will come back to fix this. We need to send payload in one go instead of having multiple endpoints for handling.
    //in the backend we just extract data that user has selected to filter out and rest can prob just stay null
    // backend then will just send respond back here and we show results.
    fetchVehiclesByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/api/v1/vehicle/filter?category=${category}`);
            set({ vehicles: response.data.vehicles, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch vehicles", loading: false });
            toast.error(error.response.data.error || "Failed to fetch vehicles");
        }
    },
    deleteVehicle: async (vehicleId) => {
        set({ loading: true });
        try {
            await axios.delete(`/api/v1/vehicle/${vehicleId}`);
            set((prevVehicles) => ({
                vehicles: prevVehicles.vehicles.filter((vehicle) => vehicle._id !== vehicleId),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to delete vehicle");
        }
    },

}));