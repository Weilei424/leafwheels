import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { useOrderStore } from "../stores/useOrderStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "axios";
import { toast } from "react-toastify";

// --- Mock dependencies ---

vi.mock("axios", () => ({
    __esModule: true,
    default: {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    },
  }));
  


vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
// Mock user store
vi.mock("../stores/useUserStore", () => ({
  useUserStore: {
    getState: vi.fn(() => ({
      accessToken: "mock-access-token",
    })),
  },
}));

describe("useOrderStore", () => {
  beforeEach(() => {
    // Reset Zustand state
    useOrderStore.setState({
      orders: [],
      currentOrder: null,
      userOrders: [],
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  // --- CREATE ORDER ---
  it("creates order and updates state on success", async () => {
    const mockOrder = { id: 1, status: "PLACED" };
    axios.post.mockResolvedValueOnce({ data: mockOrder });
    await useOrderStore.getState().createOrder("u1", { items: [123] });
    expect(useOrderStore.getState().orders[0]).toEqual(mockOrder);
    expect(useOrderStore.getState().currentOrder).toEqual(mockOrder);
    expect(useOrderStore.getState().loading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Order created successfully!");
  });

  it("sets error and calls toast on createOrder failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Failure" } },
    });
    await expect(
      useOrderStore.getState().createOrder("u1", { items: [123] })
    ).rejects.toBeDefined();
    expect(useOrderStore.getState().error).toBe("Failure");
    expect(toast.error).toHaveBeenCalledWith("Failure");
    expect(useOrderStore.getState().loading).toBe(false);
  });

  // --- GET ORDER BY ID ---
  it("fetches order by id and sets currentOrder", async () => {
    const order = { id: 99, status: "SHIPPED" };
    axios.get.mockResolvedValueOnce({ data: order });
    await useOrderStore.getState().getOrderById(99);
    expect(useOrderStore.getState().currentOrder).toEqual(order);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("handles error when fetching order by id", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { error: "Not found" } },
    });
    await expect(
      useOrderStore.getState().getOrderById("nope")
    ).rejects.toBeDefined();
    expect(useOrderStore.getState().currentOrder).toBeNull();
    expect(useOrderStore.getState().error).toBe("Not found");
    expect(toast.error).toHaveBeenCalledWith("Not found");
  });

  // --- GET ORDERS BY USER ---
  it("fetches user orders and sets userOrders", async () => {
    const orders = [{ id: 1 }, { id: 2 }];
    axios.get.mockResolvedValueOnce({ data: orders });
    await useOrderStore.getState().getOrdersByUser("u1");
    expect(useOrderStore.getState().userOrders).toEqual(orders);
  });

  it("handles error when fetching user orders", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { message: "Fetch failed" } },
    });
    await expect(
      useOrderStore.getState().getOrdersByUser("u1")
    ).rejects.toBeDefined();
    expect(useOrderStore.getState().error).toBe("Fetch failed");
    expect(toast.error).toHaveBeenCalledWith("Fetch failed");
  });

  // --- CANCEL ORDER ---
  it("cancels order and updates status", async () => {
    // Initial state with order
    useOrderStore.setState({
      orders: [{ id: 42, status: "PLACED" }],
      userOrders: [{ id: 42, status: "PLACED" }],
      currentOrder: { id: 42, status: "PLACED" },
      loading: false,
      error: null,
    });
    axios.post.mockResolvedValueOnce({});
    await useOrderStore.getState().cancelOrder(42);
    expect(useOrderStore.getState().orders[0].status).toBe("CANCELED");
    expect(useOrderStore.getState().userOrders[0].status).toBe("CANCELED");
    expect(useOrderStore.getState().currentOrder.status).toBe("CANCELED");
    expect(toast.success).toHaveBeenCalledWith("Order cancelled successfully!");
  });

  it("sets error when cancelOrder fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Cancel failed" } },
    });
    await expect(
      useOrderStore.getState().cancelOrder(123)
    ).rejects.toBeDefined();
    expect(useOrderStore.getState().error).toBe("Cancel failed");
    expect(toast.error).toHaveBeenCalledWith("Cancel failed");
    expect(useOrderStore.getState().loading).toBe(false);
  });

  // --- UTILITIES ---
  it("clearError resets error", () => {
    useOrderStore.setState({ error: "Some error" });
    useOrderStore.getState().clearError();
    expect(useOrderStore.getState().error).toBeNull();
  });

  it("clearCurrentOrder resets currentOrder", () => {
    useOrderStore.setState({ currentOrder: { id: 1 } });
    useOrderStore.getState().clearCurrentOrder();
    expect(useOrderStore.getState().currentOrder).toBeNull();
  });

  it("getStatusColor returns expected color class", () => {
    expect(useOrderStore.getState().getStatusColor("PLACED")).toMatch(/blue/);
    expect(useOrderStore.getState().getStatusColor("CANCELED")).toMatch(/red/);
    expect(useOrderStore.getState().getStatusColor("RANDOM")).toMatch(/gray/);
  });

  it("canCancelOrder returns true only for PLACED and PAID", () => {
    expect(useOrderStore.getState().canCancelOrder("PLACED")).toBe(true);
    expect(useOrderStore.getState().canCancelOrder("PAID")).toBe(true);
    expect(useOrderStore.getState().canCancelOrder("SHIPPED")).toBe(false);
  });
});
