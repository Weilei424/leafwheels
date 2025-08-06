import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { useCartStore } from "../stores/useCartStore";
import axios from "axios";
import { toast } from "react-toastify";


vi.mock("axios", () => ({
    __esModule: true,
    default: {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
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

//  Required for Zustand’s persist middleware (not used here but safe)
beforeAll(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  });
});

describe("useCartStore - addToCart", () => {
  beforeEach(() => {
    useCartStore.setState({
      cart: [],
      subtotal: 0,
      total: 0,
      savings: 0,
      loading: false,
    });
    vi.clearAllMocks();
  });

  it("adds vehicle to cart and updates state", async () => {
    const mockCart = {
      items: [{ id: 1, type: "VEHICLE", vehicle: { price: 100, discountPrice: 80 } }],
      totalPrice: 80,
    };

    axios.post.mockResolvedValueOnce({ data: mockCart });

    await useCartStore.getState().addToCart({
      id: 1,
      type: "VEHICLE",
      userId: "user123",
    });

    const state = useCartStore.getState();
    expect(state.cart.length).toBe(1);
    expect(state.total).toBe(80);
    expect(toast.success).toHaveBeenCalledWith("Item added to cart.");
  });

  it("adds accessory to cart and updates state", async () => {
    const mockCart = {
      items: [{ id: 2, type: "ACCESSORY", accessory: { price: 50, discountPrice: 40 }, quantity: 2 }],
      totalPrice: 80,
    };

    axios.post.mockResolvedValueOnce({ data: mockCart });

    await useCartStore.getState().addToCart({
      id: 2,
      type: "ACCESSORY",
      userId: "user123",
      quantity: 2,
    });

    const state = useCartStore.getState();
    expect(state.cart[0].quantity).toBe(2);
    expect(state.total).toBe(80);
    expect(toast.success).toHaveBeenCalledWith("2 items added to cart.");
  });

  it("shows error when no userId is provided", async () => {
    await useCartStore.getState().addToCart({
      id: 3,
      type: "VEHICLE",
      userId: null,
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to add items to cart");
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("shows error toast on failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Backend error" } },
    });

    await useCartStore.getState().addToCart({
      id: 4,
      type: "VEHICLE",
      userId: "user123",
    });

    expect(toast.error).toHaveBeenCalledWith("Backend error");
    expect(useCartStore.getState().cart.length).toBe(0);
  });
});
