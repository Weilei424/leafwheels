
  import axios from "axios";
  import { useVehicleStore } from "../stores/useVehicleStore";
  import { toast } from "react-toastify";
  import { useUserStore } from "../stores/useUserStore";
  import { describe, it, expect, vi, beforeEach } from "vitest";
  
  vi.mock("axios", () => ({
    __esModule: true,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  }));
  
  
  vi.mock("react-toastify", () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }));
  
  vi.mock("../stores/useUserStore", () => ({
    useUserStore: {
      getState: vi.fn(() => ({ accessToken: "mock-token" })),
    },
  }));
  



  describe("useVehicleStore", () => {
    beforeEach(() => {
      useVehicleStore.setState({
        vehicles: [],
        currentVehicle: null,
        currentVehicleHistory: [],
        loading: false,
        historyLoading: false,
        error: null,
      });
      vi.clearAllMocks();
    });
  
    it("fetches all vehicles", async () => {
      const vehicles = [{ id: 1 }, { id: 2 }];
      axios.get.mockResolvedValueOnce({ data: vehicles });
      const data = await useVehicleStore.getState().getAllVehicles();
      expect(data).toEqual(vehicles);
      expect(useVehicleStore.getState().vehicles).toEqual(vehicles);
      expect(useVehicleStore.getState().loading).toBe(false);
    });
  
    it("handles error in getAllVehicles", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "fail fetch" } } });
      await expect(useVehicleStore.getState().getAllVehicles()).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail fetch");
      expect(toast.error).toHaveBeenCalledWith("fail fetch");
      expect(useVehicleStore.getState().loading).toBe(false);
    });
  
    it("fetches vehicle by ID", async () => {
      const vehicle = { id: 1, name: "TestCar" };
      axios.get.mockResolvedValueOnce({ data: vehicle });
      const data = await useVehicleStore.getState().getVehicleById(1);
      expect(data).toEqual(vehicle);
      expect(useVehicleStore.getState().currentVehicle).toEqual(vehicle);
    });
  
    it("handles error in getVehicleById", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "bad id" } } });
      await expect(useVehicleStore.getState().getVehicleById(99)).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("bad id");
      expect(toast.error).toHaveBeenCalledWith("bad id");
      expect(useVehicleStore.getState().loading).toBe(false);
    });
  
    it("filters vehicles with params", async () => {
      axios.get.mockResolvedValueOnce({ data: { content: [{ id: 42 }] } });
      const data = await useVehicleStore.getState().filterVehicles({ make: "Ford", year: 2020 });
      expect(data.content).toBeDefined();
      expect(useVehicleStore.getState().vehicles).toEqual([{ id: 42 }]);
    });
  
    it("filters vehicles with no params", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 17 }] });
      const data = await useVehicleStore.getState().filterVehicles({});
      expect(data).toEqual([{ id: 17 }]);
      expect(useVehicleStore.getState().vehicles).toEqual([{ id: 17 }]);
    });
  
    it("handles error in filterVehicles", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "bad filter" } } });
      await expect(useVehicleStore.getState().filterVehicles({})).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("bad filter");
      expect(toast.error).toHaveBeenCalledWith("bad filter");
    });
  
    it("creates a vehicle", async () => {
      const vehicle = { id: 5, name: "New" };
      axios.post.mockResolvedValueOnce({ data: vehicle });
      useVehicleStore.setState({ vehicles: [] });
      const data = await useVehicleStore.getState().createVehicle({ name: "New" });
      expect(data).toEqual(vehicle);
      expect(useVehicleStore.getState().vehicles).toContainEqual(vehicle);
      expect(toast.success).toHaveBeenCalledWith("Vehicle created successfully!");
    });
  
    it("handles error in createVehicle", async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { message: "fail create" } } });
      await expect(useVehicleStore.getState().createVehicle({ name: "fail" })).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail create");
      expect(toast.error).toHaveBeenCalledWith("fail create");
    });
  
    it("updates a vehicle", async () => {
      const updated = { id: 2, name: "Updated" };
      useVehicleStore.setState({ vehicles: [{ id: 2, name: "Old" }], currentVehicle: { id: 2, name: "Old" } });
      axios.put.mockResolvedValueOnce({ data: updated });
      const data = await useVehicleStore.getState().updateVehicle(2, { name: "Updated" });
      expect(data).toEqual(updated);
      expect(useVehicleStore.getState().vehicles[0]).toEqual(updated);
      expect(useVehicleStore.getState().currentVehicle).toEqual(updated);
      expect(toast.success).toHaveBeenCalledWith("Vehicle updated successfully!");
    });
  
    it("handles error in updateVehicle", async () => {
      axios.put.mockRejectedValueOnce({ response: { data: { message: "fail update" } } });
      await expect(useVehicleStore.getState().updateVehicle(1, { name: "fail" })).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail update");
      expect(toast.error).toHaveBeenCalledWith("fail update");
    });
  
    it("deletes a vehicle", async () => {
      useVehicleStore.setState({ vehicles: [{ id: 2 }], currentVehicle: { id: 2 } });
      axios.delete.mockResolvedValueOnce({});
      await useVehicleStore.getState().deleteVehicle(2);
      expect(useVehicleStore.getState().vehicles.length).toBe(0);
      expect(useVehicleStore.getState().currentVehicle).toBeNull();
      expect(toast.success).toHaveBeenCalledWith("Vehicle deleted successfully!");
    });
  
    it("handles error in deleteVehicle", async () => {
      axios.delete.mockRejectedValueOnce({ response: { data: { message: "fail delete" } } });
      await expect(useVehicleStore.getState().deleteVehicle(77)).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail delete");
      expect(toast.error).toHaveBeenCalledWith("fail delete");
    });
  
    it("adds image URLs", async () => {
      const updated = { id: 9, images: ["url"] };
      useVehicleStore.setState({ vehicles: [{ id: 9, images: [] }], currentVehicle: { id: 9, images: [] } });
      axios.post.mockResolvedValueOnce({ data: updated });
      const data = await useVehicleStore.getState().addImageUrls(9, ["url"]);
      expect(data).toEqual(updated);
      expect(useVehicleStore.getState().vehicles[0]).toEqual(updated);
      expect(useVehicleStore.getState().currentVehicle).toEqual(updated);
      expect(toast.success).toHaveBeenCalledWith("Image URLs added successfully!");
    });
  
    it("handles error in addImageUrls", async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { message: "fail img" } } });
      await expect(useVehicleStore.getState().addImageUrls(1, ["fail"])).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail img");
      expect(toast.error).toHaveBeenCalledWith("fail img");
    });
  
    it("gets vehicle history by vehicle id", async () => {
      const hist = [{ id: 1 }];
      axios.get.mockResolvedValueOnce({ data: hist });
      const data = await useVehicleStore.getState().getVehicleHistoryByVehicleId(1);
      expect(data).toEqual(hist);
      expect(useVehicleStore.getState().currentVehicleHistory).toEqual(hist);
      expect(useVehicleStore.getState().historyLoading).toBe(false);
    });
  
    it("handles error in getVehicleHistoryByVehicleId", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "fail vhist" } } });
      await expect(useVehicleStore.getState().getVehicleHistoryByVehicleId(100)).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail vhist");
      expect(toast.error).toHaveBeenCalledWith("fail vhist");
    });
  
    it("gets history record by id", async () => {
      axios.get.mockResolvedValueOnce({ data: { id: 1, notes: "test" } });
      const data = await useVehicleStore.getState().getHistoryRecordById(7);
      expect(data).toEqual({ id: 1, notes: "test" });
      expect(useVehicleStore.getState().historyLoading).toBe(false);
    });
  
    it("handles error in getHistoryRecordById", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "fail record" } } });
      await expect(useVehicleStore.getState().getHistoryRecordById(44)).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail record");
      expect(toast.error).toHaveBeenCalledWith("fail record");
    });
  
    it("creates vehicle history", async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1, notes: "created" } });
      const data = await useVehicleStore.getState().createVehicleHistory({ notes: "created" });
      expect(data).toEqual({ id: 1, notes: "created" });
      expect(toast.success).toHaveBeenCalledWith("Vehicle history record created successfully!");
      expect(useVehicleStore.getState().historyLoading).toBe(false);
    });
  
    it("handles error in createVehicleHistory", async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { message: "fail create hist" } } });
      await expect(useVehicleStore.getState().createVehicleHistory({})).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail create hist");
      expect(toast.error).toHaveBeenCalledWith("fail create hist");
    });
  
    it("updates vehicle history", async () => {
      axios.put.mockResolvedValueOnce({ data: { id: 1, notes: "up" } });
      const data = await useVehicleStore.getState().updateVehicleHistory(1, { notes: "up" });
      expect(data).toEqual({ id: 1, notes: "up" });
      expect(toast.success).toHaveBeenCalledWith("Vehicle history updated successfully!");
      expect(useVehicleStore.getState().historyLoading).toBe(false);
    });
  
    it("handles error in updateVehicleHistory", async () => {
      axios.put.mockRejectedValueOnce({ response: { data: { message: "fail up hist" } } });
      await expect(useVehicleStore.getState().updateVehicleHistory(1, {})).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail up hist");
      expect(toast.error).toHaveBeenCalledWith("fail up hist");
    });
  
    it("deletes vehicle history", async () => {
      axios.delete.mockResolvedValueOnce({});
      await useVehicleStore.getState().deleteVehicleHistory(4);
      expect(toast.success).toHaveBeenCalledWith("Vehicle history deleted successfully!");
      expect(useVehicleStore.getState().historyLoading).toBe(false);
    });
  
    it("handles error in deleteVehicleHistory", async () => {
      axios.delete.mockRejectedValueOnce({ response: { data: { message: "fail del hist" } } });
      await expect(useVehicleStore.getState().deleteVehicleHistory(1)).rejects.toBeDefined();
      expect(useVehicleStore.getState().error).toBe("fail del hist");
      expect(toast.error).toHaveBeenCalledWith("fail del hist");
    });
  
    // Edge case: test the filter with an array filter param (like status)
    it("gets vehicles by status (array param)", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 1, status: "A" }] });
      const data = await useVehicleStore.getState().getVehiclesByStatus(["A"]);
      expect(data[0].status).toBe("A");
      expect(useVehicleStore.getState().vehicles[0].status).toBe("A");
    });
  
    // Edge case: test getAvailableVehicles, getVehiclesExcludingStatus
    it("gets available vehicles", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 10, status: "available" }] });
      const data = await useVehicleStore.getState().getAvailableVehicles();
      expect(data[0].status).toBe("available");
      expect(useVehicleStore.getState().vehicles[0].status).toBe("available");
    });
  
    it("gets vehicles excluding statuses", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 7, status: "NOT_RENTED" }] });
      const data = await useVehicleStore.getState().getVehiclesExcludingStatus(["RENTED"]);
      expect(data[0].status).toBe("NOT_RENTED");
      expect(useVehicleStore.getState().vehicles[0].status).toBe("NOT_RENTED");
    });
  
    // Basic clear/reset action
    it("clearError resets error to null", () => {
      useVehicleStore.setState({ error: "err" });
      useVehicleStore.getState().clearError();
      expect(useVehicleStore.getState().error).toBeNull();
    });
  
    it("clearCurrentVehicle resets currentVehicle to null", () => {
      useVehicleStore.setState({ currentVehicle: { id: 1 } });
      useVehicleStore.getState().clearCurrentVehicle();
      expect(useVehicleStore.getState().currentVehicle).toBeNull();
    });
  });
  