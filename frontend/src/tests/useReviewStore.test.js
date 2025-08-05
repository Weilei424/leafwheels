
  
  import axios from "axios";
  import { useReviewStore } from "../stores/useReviewsStore";
  import { toast } from "react-toastify";
  import { describe, it, expect, vi, beforeEach } from "vitest";
  
  vi.mock("axios", () => ({
    __esModule: true,
    default: {
      post: vi.fn(),
      get: vi.fn(),
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


  describe("useReviewStore", () => {
    beforeEach(() => {
      useReviewStore.setState({
        reviews: [],
        currentReviewSummary: null,
        userReviews: [],
        makeModelReviews: [],
        loading: false,
        error: null,
      });
      vi.clearAllMocks();
    });
  
    // --- createReview ---
    it("creates a review successfully", async () => {
      const reviewObj = { reviewId: "r1", text: "Good", make: "HONDA", model: "Civic", userId: "u1" };
      axios.post.mockResolvedValueOnce({ data: reviewObj });
      const result = await useReviewStore.getState().createReview({ text: "Good" });
      expect(result).toEqual(reviewObj);
      expect(useReviewStore.getState().reviews[0]).toEqual(reviewObj);
      expect(useReviewStore.getState().loading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith("Review submitted successfully!");
    });
  
    it("handles error on createReview", async () => {
      axios.post.mockRejectedValueOnce({ response: { data: { message: "fail create" } } });
      await expect(useReviewStore.getState().createReview({})).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("fail create");
      expect(toast.error).toHaveBeenCalledWith("fail create");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- getAllReviews ---
    it("gets all reviews successfully", async () => {
      const reviewsArr = [{ reviewId: "r1" }, { reviewId: "r2" }];
      axios.get.mockResolvedValueOnce({ data: reviewsArr });
      const result = await useReviewStore.getState().getAllReviews();
      expect(result).toEqual(reviewsArr);
      expect(useReviewStore.getState().reviews).toEqual(reviewsArr);
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    it("handles error on getAllReviews", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { error: "fetch fail" } } });
      await expect(useReviewStore.getState().getAllReviews()).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("fetch fail");
      expect(toast.error).toHaveBeenCalledWith("fetch fail");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- getReviewsByUser ---
    it("gets user reviews successfully", async () => {
      const userRevs = [{ reviewId: "r4", userId: "u1" }];
      axios.get.mockResolvedValueOnce({ data: userRevs });
      const result = await useReviewStore.getState().getReviewsByUser("u1");
      expect(result).toEqual(userRevs);
      expect(useReviewStore.getState().userReviews).toEqual(userRevs);
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    it("handles error on getReviewsByUser", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "user fail" } } });
      await expect(useReviewStore.getState().getReviewsByUser("fail")).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("user fail");
      expect(toast.error).toHaveBeenCalledWith("user fail");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- getReviewsByMakeAndModel ---
    it("gets reviews by make and model", async () => {
      const mmRevs = [{ reviewId: "r7", make: "HONDA", model: "Civic" }];
      axios.get.mockResolvedValueOnce({ data: mmRevs });
      const result = await useReviewStore.getState().getReviewsByMakeAndModel("honda", "Civic");
      expect(result).toEqual(mmRevs);
      expect(useReviewStore.getState().makeModelReviews).toEqual(mmRevs);
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    it("handles error on getReviewsByMakeAndModel", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { error: "mm fail" } } });
      await expect(useReviewStore.getState().getReviewsByMakeAndModel("h", "bad")).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("mm fail");
      expect(toast.error).toHaveBeenCalledWith("mm fail");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- getReviewSummary ---
    it("gets review summary", async () => {
      const summary = { avg: 5, count: 10 };
      axios.get.mockResolvedValueOnce({ data: summary });
      const result = await useReviewStore.getState().getReviewSummary("Honda", "Civic");
      expect(result).toEqual(summary);
      expect(useReviewStore.getState().currentReviewSummary).toEqual(summary);
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    it("handles error on getReviewSummary", async () => {
      axios.get.mockRejectedValueOnce({ response: { data: { message: "summary fail" } } });
      await expect(useReviewStore.getState().getReviewSummary("h", "fail")).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("summary fail");
      expect(toast.error).toHaveBeenCalledWith("summary fail");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- deleteReview ---
    it("deletes review successfully", async () => {
      useReviewStore.setState({
        reviews: [{ reviewId: "r10" }],
        userReviews: [{ reviewId: "r10" }],
        makeModelReviews: [{ reviewId: "r10" }],
        loading: false,
      });
      axios.delete.mockResolvedValueOnce({});
      await useReviewStore.getState().deleteReview("r10");
      expect(useReviewStore.getState().reviews).toEqual([]);
      expect(useReviewStore.getState().userReviews).toEqual([]);
      expect(useReviewStore.getState().makeModelReviews).toEqual([]);
      expect(toast.success).toHaveBeenCalledWith("Review deleted successfully!");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    it("handles error on deleteReview", async () => {
      axios.delete.mockRejectedValueOnce({ response: { data: { error: "fail delete" } } });
      await expect(useReviewStore.getState().deleteReview("notfound")).rejects.toBeDefined();
      expect(useReviewStore.getState().error).toBe("fail delete");
      expect(toast.error).toHaveBeenCalledWith("fail delete");
      expect(useReviewStore.getState().loading).toBe(false);
    });
  
    // --- clearError / hasUserReviewedVehicle ---
    it("clearError resets error to null", () => {
      useReviewStore.setState({ error: "e" });
      useReviewStore.getState().clearError();
      expect(useReviewStore.getState().error).toBeNull();
    });
  
    it("hasUserReviewedVehicle returns true if reviewed", () => {
      useReviewStore.setState({
        userReviews: [
          { userId: "uX", make: "HONDA", model: "Civic" }
        ]
      });
      const result = useReviewStore.getState().hasUserReviewedVehicle("uX", "honda", "Civic");
      expect(result).toBe(true);
    });
  
    it("hasUserReviewedVehicle returns false if not reviewed", () => {
      useReviewStore.setState({ userReviews: [] });
      const result = useReviewStore.getState().hasUserReviewedVehicle("none", "HONDA", "Civic");
      expect(result).toBe(false);
    });
  });
  