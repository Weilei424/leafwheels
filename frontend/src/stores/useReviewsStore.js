import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "./useUserStore";

// Helper function to get auth headers for authenticated operations
const getAuthHeaders = () => {
    const { accessToken } = useUserStore.getState();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const useReviewStore = create((set, get) => ({
    // State
    reviews: [],
    currentReviewSummary: null,
    userReviews: [],
    makeModelReviews: [],
    loading: false,
    error: null,

    // Clear functions
    clearError: () => set({ error: null }),

    /**
     * Create a new review
     * Endpoint: POST /api/v1/reviews - REQUIRES AUTH
     * Body: ReviewDto
     */
    createReview: async (reviewData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/api/v1/reviews", reviewData, {
                headers: getAuthHeaders()
            });

            set((prevState) => ({
                reviews: [response.data, ...prevState.reviews],
                loading: false,
            }));

            toast.success("Review submitted successfully!");
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to submit review";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get all reviews
     * Endpoint: GET /api/v1/reviews - PUBLIC
     */
    getAllReviews: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/v1/reviews");
            set({
                reviews: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch reviews";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get reviews by user ID
     * Endpoint: GET /api/v1/reviews/user/{userId} - PUBLIC
     */
    getReviewsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/reviews/user/${userId}`);
            set({
                userReviews: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch user reviews";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get reviews by make and model
     * Endpoint: GET /api/v1/reviews/make/{make}/model/{model} - PUBLIC
     */
    getReviewsByMakeAndModel: async (make, model) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/reviews/make/${make.toUpperCase()}/model/${encodeURIComponent(model)}`);

            set({
                makeModelReviews: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch reviews for this vehicle";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Get review summary for make and model
     * Endpoint: GET /api/v1/reviews/make/{make}/model/{model}/summary - PUBLIC
     */
    getReviewSummary: async (make, model) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/v1/reviews/make/${make.toUpperCase()}/model/${encodeURIComponent(model)}/summary`);
            set({
                currentReviewSummary: response.data,
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch review summary";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Delete a review
     * Endpoint: DELETE /api/v1/reviews/{reviewId} - REQUIRES AUTH
     */
    deleteReview: async (reviewId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/v1/reviews/${reviewId}`, {
                headers: getAuthHeaders()
            });

            set((prevState) => ({
                reviews: prevState.reviews.filter(review => review.reviewId !== reviewId),
                userReviews: prevState.userReviews.filter(review => review.reviewId !== reviewId),
                makeModelReviews: prevState.makeModelReviews.filter(review => review.reviewId !== reviewId),
                loading: false,
            }));

            toast.success("Review deleted successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete review";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    /**
     * Helper function to check if user has already reviewed a make/model
     */
    hasUserReviewedVehicle: (userId, make, model) => {
        const { userReviews } = get();
        return userReviews.some(review =>
            review.userId === userId &&
            review.make === make.toUpperCase() &&
            review.model === model
        );
    },
}));