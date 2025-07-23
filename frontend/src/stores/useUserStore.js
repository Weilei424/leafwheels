// ======================================================
//  Notes
//
// Purpose:
// - Manage user authentication state using Zustand.
// - Handle signup, login, logout, auth checking, and token refreshing.
// - Automatically refresh tokens on expiry via Axios interceptor.
// - Show user feedback using react-toastify.
//
// Key Concepts:
// - Zustand global store for managing user and auth state.
// - Toast notifications for real-time user feedback.
// - Axios interceptor for handling expired tokens automatically.
//
// Core Flow:
// 1. User triggers an auth action → update state → show toast.
// 2. If token expires → Axios interceptor refreshes token → retries the failed request.
// 3. Zustand store acts as the central state manager.
// ======================================================

import { create } from "zustand"; // Zustand for state management.
import axios from "axios";
import { toast } from "react-toastify"; // Toast notifications.

export const useUserStore = create((set, get) => ({
    // ================= State Variables =================
    user: null,           // Stores the logged-in user's data.
    loading: false,       // Tracks if an API request is in progress.
    checkingAuth: true,   // Tracks if we're checking if the user is logged in.

    // ================= Signup Function =================
    // Registers a new user.
    signup: async (firstName, lastName, email, password, confirmPassword) => {
        set({ loading: true });

        console.log("here", firstName, lastName, email, password, confirmPassword);


        // Password validation check.
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }


        try {
            const res = await axios.post("/api/v1/auth/signup", {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
            });

            set({ user: res.data, loading: false });
            toast.success("Signup successful!"); // Notify user.
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    // ================= Login Function =================
    // Logs in an existing user.
    login: async (email, password) => {
        set({loading: true});

        try {
            const res = await axios.post("/api/v1/auth/signin", {email, password});
            console.log(res.data);
            set({user: res.data, loading: false});
            toast.success("Login successful!"); // Notify user.
        } catch (error) {
            set({loading: false});
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    // // ================= Logout Function =================
    // // Logs out the current user.
    // logout: async () => {
    //     try {
    //         await axios.post("/auth/logout");
    //         set({ user: null });
    //         toast.success("Logged out successfully!"); // Notify user.
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "An error occurred during logout");
    //     }
    // },

//     // ================= Auth Check Function =================
//     // Checks if the user is currently logged in (used on page load).
//     checkAuth: async () => {
//         set({ checkingAuth: true });
//
//         try {
//             const response = await axios.get("/auth/profile");
//             set({ user: response.data, checkingAuth: false });
//         } catch (error) {
//             console.log(error.message);
//             set({ checkingAuth: false, user: null });
//         }
//     },
//
//     // ================= Refresh Token Function =================
//     // Requests a new token if the current one expires.
//     refreshToken: async () => {
//         // Prevent multiple refresh requests at the same time.
//         if (get().checkingAuth) return;
//
//         set({ checkingAuth: true });
//
//         try {
//             const response = await axios.post("/auth/refresh-token");
//             set({ checkingAuth: false });
//             return response.data; // Return new token.
//         } catch (error) {
//             set({ user: null, checkingAuth: false });
//             throw error; // Pass the error up the chain.
//         }
//     },
// }));

// // ================= Axios Interceptor =================
// // Handles token expiration and automatically refreshes the token.
//
// let refreshPromise = null; // Ensures only one refresh request happens at a time.
//
// axios.interceptors.response.use(
//     (response) => response, // If response is successful, return it directly.
//     async (error) => {
//         const originalRequest = error.config;
//
//         // If the request failed due to an expired token (401), attempt refresh.
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true; // Prevent retry loops.
//
//             try {
//                 // If a token refresh is already happening, wait for it to finish.
//                 if (refreshPromise) {
//                     await refreshPromise;
//                     return axios(originalRequest); // Retry the original request.
//                 }
//
//                 // Start a new token refresh.
//                 refreshPromise = useUserStore.getState().refreshToken();
//                 await refreshPromise;
//                 refreshPromise = null;
//
//                 return axios(originalRequest); // Retry the original request after refreshing.
//             } catch (refreshError) {
//                 // If refreshing fails, log the user out.
//                 useUserStore.getState().logout();
//                 return Promise.reject(refreshError);
//             }
//         }
//
//         return Promise.reject(error); // Pass any other errors along.
//     }
}));
