
  
import axios from "axios";
import { useAccessoryStore } from "../stores/useAccessoryStore";


import { describe, it, expect, vi, beforeEach } from "vitest";

import { useUserStore } from "../stores/useUserStore";

import { toast } from "react-toastify";

  
vi.mock("axios", () => ({
    __esModule: true,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: { response: { use: vi.fn() } }
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
    getState: vi.fn(() => ({
      accessToken: "mock-token",
    })),
  },
}));

describe("useAccessoryStore", () => {
  beforeEach(() => {
    useAccessoryStore.setState({
      accessories: [],
      currentAccessory: null,
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  // ----- getAllAccessories -----
  it("fetches all accessories successfully", async () => {
    const mockAccessories = [{ id: 1 }, { id: 2 }];
    axios.get.mockResolvedValueOnce({ data: mockAccessories });
    const result = await useAccessoryStore.getState().getAllAccessories();
    expect(result).toEqual(mockAccessories);
    expect(useAccessoryStore.getState().accessories).toEqual(mockAccessories);
    expect(useAccessoryStore.getState().loading).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("handles error on getAllAccessories", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { message: "Fetch error" } },
    });
    await expect(useAccessoryStore.getState().getAllAccessories()).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Fetch error");
    expect(toast.error).toHaveBeenCalledWith("Fetch error");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- getAccessoryById -----
  it("fetches accessory by id successfully", async () => {
    const mockAccessory = { id: 10, name: "Test Accessory" };
    axios.get.mockResolvedValueOnce({ data: mockAccessory });
    const result = await useAccessoryStore.getState().getAccessoryById(10);
    expect(result).toEqual(mockAccessory);
    expect(useAccessoryStore.getState().currentAccessory).toEqual(mockAccessory);
    expect(toast.error).not.toHaveBeenCalled();
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  it("handles error on getAccessoryById", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { message: "Not found" } },
    });
    await expect(useAccessoryStore.getState().getAccessoryById(999)).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Not found");
    expect(useAccessoryStore.getState().currentAccessory).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Not found");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- createAccessory -----
  it("creates accessory successfully", async () => {
    const newAccessory = { id: 42, name: "New One" };
    axios.post.mockResolvedValueOnce({ data: newAccessory });
    const result = await useAccessoryStore.getState().createAccessory({ name: "New One" });
    expect(result).toEqual(newAccessory);
    expect(useAccessoryStore.getState().accessories).toContainEqual(newAccessory);
    expect(toast.success).toHaveBeenCalledWith("Accessory created successfully!");
    expect(useAccessoryStore.getState().loading).toBe(false);
    // check headers sent
    expect(axios.post).toHaveBeenCalledWith(
      "/api/v1/accessories",
      { name: "New One" },
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it("handles error on createAccessory", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Create fail" } },
    });
    await expect(useAccessoryStore.getState().createAccessory({ name: "fail" })).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Create fail");
    expect(toast.error).toHaveBeenCalledWith("Create fail");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- updateAccessory -----
  it("updates accessory successfully", async () => {
    useAccessoryStore.setState({
      accessories: [{ id: 100, name: "Old" }],
      currentAccessory: { id: 100, name: "Old" },
      loading: false,
      error: null,
    });
    const updated = { id: 100, name: "Updated" };
    axios.put.mockResolvedValueOnce({ data: updated });
    const result = await useAccessoryStore.getState().updateAccessory(100, { name: "Updated" });
    expect(result).toEqual(updated);
    expect(useAccessoryStore.getState().accessories[0]).toEqual(updated);
    expect(useAccessoryStore.getState().currentAccessory).toEqual(updated);
    expect(toast.success).toHaveBeenCalledWith("Accessory updated successfully!");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  it("handles error on updateAccessory", async () => {
    axios.put.mockRejectedValueOnce({
      response: { data: { message: "Update error" } },
    });
    await expect(useAccessoryStore.getState().updateAccessory(5, { name: "nope" })).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Update error");
    expect(toast.error).toHaveBeenCalledWith("Update error");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- deleteAccessory -----
  it("deletes accessory successfully", async () => {
    useAccessoryStore.setState({
      accessories: [{ id: 7 }, { id: 8 }],
      currentAccessory: { id: 7 },
      loading: false,
      error: null,
    });
    axios.delete.mockResolvedValueOnce({});
    await useAccessoryStore.getState().deleteAccessory(7);
    expect(useAccessoryStore.getState().accessories).toEqual([{ id: 8 }]);
    expect(useAccessoryStore.getState().currentAccessory).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Accessory deleted successfully!");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  it("handles error on deleteAccessory", async () => {
    axios.delete.mockRejectedValueOnce({
      response: { data: { message: "Delete error" } },
    });
    await expect(useAccessoryStore.getState().deleteAccessory(1)).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Delete error");
    expect(toast.error).toHaveBeenCalledWith("Delete error");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- addImageUrls -----
  it("adds image urls to accessory successfully", async () => {
    useAccessoryStore.setState({
      accessories: [{ id: 200, images: [] }],
      currentAccessory: { id: 200, images: [] },
      loading: false,
      error: null,
    });
    const updated = { id: 200, images: ["url1", "url2"] };
    axios.post.mockResolvedValueOnce({ data: updated });
    const result = await useAccessoryStore.getState().addImageUrls(200, ["url1", "url2"]);
    expect(result).toEqual(updated);
    expect(useAccessoryStore.getState().accessories[0]).toEqual(updated);
    expect(useAccessoryStore.getState().currentAccessory).toEqual(updated);
    expect(toast.success).toHaveBeenCalledWith("Image URLs added successfully!");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  it("handles error on addImageUrls", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Image fail" } },
    });
    await expect(useAccessoryStore.getState().addImageUrls(200, ["fail"])).rejects.toBeDefined();
    expect(useAccessoryStore.getState().error).toBe("Image fail");
    expect(toast.error).toHaveBeenCalledWith("Image fail");
    expect(useAccessoryStore.getState().loading).toBe(false);
  });

  // ----- clearError / clearCurrentAccessory -----
  it("clearError resets error to null", () => {
    useAccessoryStore.setState({ error: "some error" });
    useAccessoryStore.getState().clearError();
    expect(useAccessoryStore.getState().error).toBeNull();
  });

  it("clearCurrentAccessory resets currentAccessory to null", () => {
    useAccessoryStore.setState({ currentAccessory: { id: 1 } });
    useAccessoryStore.getState().clearCurrentAccessory();
    expect(useAccessoryStore.getState().currentAccessory).toBeNull();
  });
});
