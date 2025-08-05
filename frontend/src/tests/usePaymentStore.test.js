

  import axios from "axios";
  import { usePaymentStore } from "../stores/usePaymentStore";
  import { toast } from "react-toastify";
  import { useUserStore } from "../stores/useUserStore";
  import { describe, it, expect, vi, beforeEach } from "vitest";


  vi.mock("axios", () => ({
    __esModule: true,
    default: {
      post: vi.fn(),
      get: vi.fn(),
    },
    post: vi.fn(),
    get: vi.fn(),
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

describe("usePaymentStore", () => {
  beforeEach(() => {
    // Reset all store state and clear all mocks before every test
    usePaymentStore.setState({
      paymentSession: null,
      paymentResult: null,
      paymentHistory: [],
      creatingSession: false,
      processingPayment: false,
      loadingHistory: false,
      canceling: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  // --- createPaymentSession ---
  it("creates a payment session (success)", async () => {
    axios.post.mockResolvedValueOnce({ data: { sessionId: "sess123" } });
    const data = await usePaymentStore.getState().createPaymentSession("user1");
    expect(data.sessionId).toBe("sess123");
    expect(usePaymentStore.getState().paymentSession.sessionId).toBe("sess123");
    expect(toast.success).toHaveBeenCalledWith("Payment session created!");
    expect(usePaymentStore.getState().creatingSession).toBe(false);
  });

  it("handles failure to create payment session", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: "fail!" } } });
    await expect(usePaymentStore.getState().createPaymentSession("user2")).rejects.toBeDefined();
    expect(usePaymentStore.getState().error).toBe("fail!");
    expect(toast.error).toHaveBeenCalledWith("fail!");
    expect(usePaymentStore.getState().creatingSession).toBe(false);
  });

  // --- processPayment ---
  it("processes payment successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { status: "APPROVED", transactionId: "txn9" } });
    const result = await usePaymentStore.getState().processPayment({ some: "data" });
    expect(result.status).toBe("APPROVED");
    expect(usePaymentStore.getState().paymentResult.transactionId).toBe("txn9");
    expect(usePaymentStore.getState().processingPayment).toBe(false);
  });

  it("handles failure on processPayment", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: "rejected" } } });
    await expect(usePaymentStore.getState().processPayment({})).rejects.toBeDefined();
    expect(usePaymentStore.getState().error).toBe("rejected");
    expect(usePaymentStore.getState().processingPayment).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("rejected");
  });

  // --- getPaymentStatus ---
  it("gets payment status (success)", async () => {
    axios.get.mockResolvedValueOnce({ data: { status: "PENDING" } });
    const data = await usePaymentStore.getState().getPaymentStatus("oid999");
    expect(data.status).toBe("PENDING");
    expect(usePaymentStore.getState().loadingHistory).toBe(false);
  });

  it("handles error in getPaymentStatus", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { message: "status fail" } } });
    await expect(usePaymentStore.getState().getPaymentStatus("oidX")).rejects.toBeDefined();
    expect(usePaymentStore.getState().error).toBe("status fail");
    expect(toast.error).toHaveBeenCalledWith("status fail");
    expect(usePaymentStore.getState().loadingHistory).toBe(false);
  });

  // --- getPaymentHistory ---
  it("gets payment history successfully", async () => {
    const fakeHistory = [{ id: 1, userId: "u1" }, { id: 2, userId: "u1" }];
    axios.get.mockResolvedValueOnce({ data: fakeHistory });
    const data = await usePaymentStore.getState().getPaymentHistory("u1");
    expect(data.length).toBe(2);
    expect(usePaymentStore.getState().paymentHistory).toEqual(fakeHistory);
    expect(usePaymentStore.getState().loadingHistory).toBe(false);
  });

  it("handles error in getPaymentHistory", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { message: "history failed" } } });
    await expect(usePaymentStore.getState().getPaymentHistory("u99")).rejects.toBeDefined();
    expect(usePaymentStore.getState().error).toBe("history failed");
    expect(toast.error).toHaveBeenCalledWith("history failed");
    expect(usePaymentStore.getState().loadingHistory).toBe(false);
  });

  // --- cancelPayment ---
  it("cancels payment and refreshes history", async () => {
    // Arrange state with dummy history (triggers refreshPaymentHistoryIfAvailable)
    usePaymentStore.setState({
      paymentHistory: [{ id: 1, userId: "u5" }],
      canceling: false,
      error: null,
    });
    axios.post.mockResolvedValueOnce({}); // cancelPayment
    axios.get.mockResolvedValueOnce({ data: [] }); // for getPaymentHistory refresh

    await usePaymentStore.getState().cancelPayment("ord12");
    expect(usePaymentStore.getState().canceling).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Payment cancelled and refunded successfully");
    // paymentHistory should have been refreshed (called with userId)
    expect(axios.get).toHaveBeenCalledWith(
      "/api/v1/payment/user/u5",
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it("handles error on cancelPayment", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: "fail cancel" } } });
    await expect(usePaymentStore.getState().cancelPayment("oidERR")).rejects.toBeDefined();
    expect(usePaymentStore.getState().error).toBe("fail cancel");
    expect(toast.error).toHaveBeenCalledWith("fail cancel");
    expect(usePaymentStore.getState().canceling).toBe(false);
  });

  // --- clear/reset actions (basic state checks) ---
  it("clearError resets error to null", () => {
    usePaymentStore.setState({ error: "bad" });
    usePaymentStore.getState().clearError();
    expect(usePaymentStore.getState().error).toBeNull();
  });

  it("clearPaymentResult resets paymentResult", () => {
    usePaymentStore.setState({ paymentResult: { foo: 1 } });
    usePaymentStore.getState().clearPaymentResult();
    expect(usePaymentStore.getState().paymentResult).toBeNull();
  });

  it("resetPaymentFlow resets relevant state", () => {
    usePaymentStore.setState({
      paymentSession: { foo: 1 },
      paymentResult: { bar: 2 },
      error: "test",
    });
    usePaymentStore.getState().resetPaymentFlow();
    expect(usePaymentStore.getState().paymentSession).toBeNull();
    expect(usePaymentStore.getState().paymentResult).toBeNull();
    expect(usePaymentStore.getState().error).toBeNull();
  });
});
