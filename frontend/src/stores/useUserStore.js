
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

export const useUserStore = create(
    persist(
        (set, get) => ({
            // ================= State Variables =================
            user: null,              // User data from backend
            accessToken: null,       // JWT access token
            refreshToken: null,      // JWT refresh token
            loading: false,          // Loading state for auth operations
            checkingAuth: false,     // Minimal auth check

            // ================= Auth Check Function =================
            checkAuth: async () => {
                const { accessToken, refreshToken } = get();

                if (accessToken && refreshToken) {
                    // User has tokens, consider them logged in
                    set({ checkingAuth: false });
                } else {
                    // No tokens, user not logged in
                    set({ checkingAuth: false, user: null });
                }
            },

            // ================= Signup Function =================
            signup: async (firstName, lastName, email, password, confirmPassword) => {
                set({ loading: true });

                try {
                    const response = await axios.post("/api/v1/auth/signup", {
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword
                    });

                    const { user, accessToken, refreshToken } = response.data;

                    // Store tokens and user data
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        loading: false
                    });

                    toast.success("Account created successfully!");
                    return { success: true, user };

                } catch (error) {
                    set({ loading: false });
                    const errorMessage = error.response?.data?.message || "Signup failed.";
                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            // ================= Login Function =================
            login: async (email, password) => {
                set({ loading: true });

                try {
                    const response = await axios.post("/api/v1/auth/signin", {
                        email,
                        password,
                    });

                    const { user, accessToken, refreshToken } = response.data;

                    // Store tokens and user data
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        loading: false
                    });

                    toast.success(`Welcome back, ${user.firstName}!`);
                    return { success: true, user };

                } catch (error) {
                    set({ loading: false });
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        "Login failed";
                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            // ================= Logout Function =================
            logout: async () => {
                const { refreshToken } = get();

                try {
                    // Call backend logout if refresh token exists
                    if (refreshToken) {
                        await axios.post("/api/v1/auth/signout", {
                            refreshToken,
                        });
                    }
                } catch (error) {
                    console.log("Logout error:", error);
                    // Continue with logout even if backend call fails
                }

                // Clear everything
                get().clearAuth();
                toast.success("Logged out successfully!");
            },

            // ================= FIXED Refresh Token Function =================
            refreshTokens: async () => {
                const { refreshToken } = get();

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                try {
                    const response = await axios.post("/api/v1/auth/refresh", {
                        refreshToken,
                    });

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                    // Update tokens in store
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    });

                    // Return the new access token for immediate use
                    return newAccessToken;

                } catch (error) {
                    console.log("Token refresh failed:", error);
                    get().clearAuth();
                    throw error;
                }
            },

            // ================= Password Reset Functions =================
            forgotPassword: async (email) => {
                set({ loading: true });

                try {
                    await axios.post("/api/v1/auth/forgot-password", { email });
                    set({ loading: false });
                    toast.success("Password reset link sent to your email!");
                    return { success: true };

                } catch (error) {
                    set({ loading: false });
                    const errorMessage = error.response?.data?.message || "Failed to send reset email";
                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            resetPassword: async (token, newPassword) => {
                set({ loading: true });

                try {
                    await axios.post("/api/v1/auth/reset-password", {
                        token,
                        newPassword,
                    });

                    set({ loading: false });
                    toast.success("Password reset successfully!");
                    return { success: true };

                } catch (error) {
                    set({ loading: false });
                    const errorMessage = error.response?.data?.message || "Failed to reset password";
                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            // ================= Helper Functions =================
            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    checkingAuth: false
                });
            },

            // Get current auth status
            isAuthenticated: () => {
                const { user, accessToken } = get();
                return !!(user && accessToken);
            },

            // Get user role
            getUserRole: () => {
                const { user } = get();
                return user?.role || null;
            },
        }),
        {
            name: "user-store", // Storage key
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }), // Only persist these fields
        }
    )
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle BOTH 401 AND 403 for expired tokens
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await useUserStore.getState().refreshTokens();

                // Process all queued requests with new token
                processQueue(null, newAccessToken);

                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axios(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                useUserStore.getState().clearAuth();

                // Let the operation fail gracefully
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ================= Initialize Auth on App Start =================
if (typeof window !== 'undefined') {
    useUserStore.getState().checkAuth();
}