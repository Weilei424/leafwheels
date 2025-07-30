import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useLoanCalculatorStore = create((set) => ({
    // Calculation results
    calculationResults: null,

    // Loading and error states
    loading: false,
    error: null,

    // Clear error
    clearError: () => set({ error: null }),

    // Clear results
    /**
     * Calculate loan based on user inputs
     *
     * Endpoint: POST /api/v1/loan-calculator/calculate
     * Body: LoanCalculationRequestDto
     * Returns: LoanCalculationResponseDto
     */
    calculateLoan: async (loanData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/loan-calculator/calculate", loanData);

            set({
                calculationResults: response.data,
                loading: false
            });

            toast.success("Loan calculation completed!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to calculate loan.";
            set({
                error: errorMessage,
                loading: false
            });
            toast.error(errorMessage);
            throw error;
        }
    },
}));