// ======================================================
//  Updated User Store with JWT Authentication
//
// Purpose:
// - Manage user authentication state using Zustand
// - Handle JWT tokens (access & refresh)
// - Automatic token refresh via Axios interceptor
// - Works with your completed backend AuthController
//
// Flow:
// 1. Signup/Signin → Store JWT tokens → Set user data
// 2. API calls include JWT header automatically
// 3. Token expires → Auto-refresh → Retry original request
// 4. Logout → Clear tokens and user data
// ======================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

// Configure axios defaults
axios.defaults.withCredentials = true;

export const useUserStore = create(
    persist(
        (set, get) => ({
            // ================= State Variables =================
            user: null,              // User data from backend
            accessToken: null,       // JWT access token
            refreshToken: null,      // JWT refresh token
            loading: false,          // Loading state for auth operations
            checkingAuth: true,      // Initial auth check on app load

            // ================= Auth Check Function =================
            // Check if user is authenticated on app startup
            checkAuth: async () => {
                const { accessToken, refreshToken } = get();

                if (!accessToken || !refreshToken) {
                    set({ checkingAuth: false, user: null });
                    return;
                }

                try {
                    // Set token in axios headers
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    set({ checkingAuth: false });
                } catch (error) {
                    get().clearAuth();
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

                    // Set authorization header for future requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    toast.success("Account created successfully!");
                    return { success: true, user };

                } catch (error) {
                    set({ loading: false });
                    const errorMessage = "Signup failed.";
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

                    // Set authorization header for future requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

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
                    // Continue with logout even if backend call fails
                }

                // Clear everything
                get().clearAuth();
                toast.success("Logged out successfully!");
            },

            // ================= Refresh Token Function =================
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

                    // Update tokens
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    });

                    // Update authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    return { accessToken: newAccessToken, refreshToken: newRefreshToken };

                } catch (error) {
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
                delete axios.defaults.headers.common['Authorization'];
            },

            // Get current auth status
            isAuthenticated: () => {
                const { user, accessToken } = get();
                return !!(user && accessToken);
            },

            // Get user role
            getUserRole: () => {
                if (!get().user) return null;
                const { user } = get();
                return user.role
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

// ================= Axios Interceptor =================
// Automatically handle token refresh on 401 errors
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

        if (error.response?.status === 401 && !originalRequest._retry) {
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
                const { accessToken } = await useUserStore.getState().refreshTokens();
                processQueue(null, accessToken);

                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                useUserStore.getState().clearAuth();

                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ================= Initialize Auth on App Start =================
// Check authentication status when the store is created
if (typeof window !== 'undefined') {
    useUserStore.getState().checkAuth();
}