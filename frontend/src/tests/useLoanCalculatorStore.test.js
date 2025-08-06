import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useLoanCalculatorStore } from "../stores/useLoanCalculatorStore";
import { toast } from "react-toastify";

// ---- MOCKS ----
vi.mock("axios", () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
}));
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useLoanCalculatorStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useLoanCalculatorStore.setState({
      calculationResults: null,
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("calculates loan and sets results on success", async () => {
    const mockResult = { total: 30000, monthly: 250 };
    axios.post.mockResolvedValueOnce({ data: mockResult });

    const input = { principal: 25000, years: 10, rate: 3.5 };
    const result = await useLoanCalculatorStore.getState().calculateLoan(input);

    expect(result).toEqual(mockResult);
    expect(useLoanCalculatorStore.getState().calculationResults).toEqual(mockResult);
    expect(useLoanCalculatorStore.getState().loading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Loan calculation completed!");
    expect(axios.post).toHaveBeenCalledWith(
      "/api/v1/loan-calculator/calculate",
      input
    );
  });

  it("sets error and calls toast on failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Calculation error" } },
    });

    await expect(
      useLoanCalculatorStore.getState().calculateLoan({ principal: 0 })
    ).rejects.toBeDefined();

    expect(useLoanCalculatorStore.getState().error).toBe("Calculation error");
    expect(toast.error).toHaveBeenCalledWith("Calculation error");
    expect(useLoanCalculatorStore.getState().loading).toBe(false);
  });

  it("sets fallback error when error message is missing", async () => {
    axios.post.mockRejectedValueOnce({});
    await expect(
      useLoanCalculatorStore.getState().calculateLoan({ principal: 0 })
    ).rejects.toBeDefined();
    expect(useLoanCalculatorStore.getState().error).toBe("Failed to calculate loan.");
    expect(toast.error).toHaveBeenCalledWith("Failed to calculate loan.");
    expect(useLoanCalculatorStore.getState().loading).toBe(false);
  });

  it("clearError resets error to null", () => {
    useLoanCalculatorStore.setState({ error: "Some error" });
    useLoanCalculatorStore.getState().clearError();
    expect(useLoanCalculatorStore.getState().error).toBeNull();
  });
});
