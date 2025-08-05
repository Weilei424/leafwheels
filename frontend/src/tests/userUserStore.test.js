import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

import { useUserStore } from "../stores/useUserStore";
import axios from "axios";

import { toast } from "react-toastify";


// Mock the toast API so that no real UI notifications are triggered during tests
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock axios globally. The store under test imports axios directly, so we need
// to intercept its calls. Provide stubbed post/get methods and a response
// interceptor chain so the store can register interceptors without error.
vi.mock("axios", () => ({
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



// Provide a basic localStorage implementation. The Zustand `persist` middleware
// tries to access `localStorage` when saving state. In a Node/Vitest environment
// there is no window or localStorage available by default, so define minimal
// stubbed methods to avoid warnings or runtime errors.
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

describe("useUserStore - signup", () => {
  beforeEach(() => {
    // Reset Zustand store state to a clean slate before each test.
    useUserStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      checkingAuth: false,
    });
    // Clear all previous mock calls
    vi.clearAllMocks();
  });

  it("sets user and shows success toast on successful signup", async () => {
    const userData = {
      id: 1,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    };
    const accessToken = "test-access-token";
    const refreshToken = "test-refresh-token";
    // Stub axios.post to resolve with the structure returned by the current
    // signup implementation: an object with `user`, `accessToken` and
    // `refreshToken` fields nested inside `data`.
    axios.post.mockResolvedValueOnce({
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });

    await useUserStore.getState().signup(
      "Test",
      "User",
      "test@example.com",
      "abc123",
      "abc123"
    );

    const state = useUserStore.getState();
    expect(state.user).toEqual(userData);
    expect(state.accessToken).toEqual(accessToken);
    expect(state.refreshToken).toEqual(refreshToken);
    expect(state.loading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
    // Ensure axios.post was called with the correct endpoint and payload
    expect(axios.post).toHaveBeenCalledWith(
      "/api/v1/auth/signup",
      {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "abc123",
        confirmPassword: "abc123",
      }
    );
  });

  it("shows error toast when backend reports passwords do not match", async () => {
    // Simulate a backend rejection where the password and confirmPassword do not match.
    const errorMessage = "Passwords do not match";
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });

    await useUserStore.getState().signup(
      "Mismatch",
      "User",
      "mismatch@example.com",
      "abc123",
      "wrong123"
    );

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    // The store should surface the error returned by the backend via toast.error
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("shows error toast and does not set user on backend failure", async () => {
    const errorMessage = "Email already exists";
    // Reject with an error payload containing a message
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });
    await useUserStore.getState().signup(
      "Error",
      "Test",
      "fail@example.com",
      "abc123",
      "abc123"
    );
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(axios.post).toHaveBeenCalledWith(
      "/api/v1/auth/signup",
      {
        firstName: "Error",
        lastName: "Test",
        email: "fail@example.com",
        password: "abc123",
        confirmPassword: "abc123",
      }
    );
  });

  it("handles empty response gracefully (no data returned)", async () => {
    // Simulate an empty response from the backend. The store should not
    // erroneously treat the operation as successful.
    axios.post.mockResolvedValueOnce({ data: {} });
    await useUserStore.getState().signup(
      "Edge",
      "Case",
      "edge@example.com",
      "abc123",
      "abc123"
    );
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.loading).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe("useUserStore - login", () => {
  beforeEach(() => {
    useUserStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      checkingAuth: false,
    });
    vi.clearAllMocks();
  });

  it("sets user and shows toast on successful login", async () => {
    const userData = {
      id: 2,
      firstName: "Login",
      lastName: "User",
      email: "login@example.com",
    };
    const accessToken = "login-access";
    const refreshToken = "login-refresh";
    axios.post.mockResolvedValueOnce({
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
    await useUserStore.getState().login("login@example.com", "abc123");
    const state = useUserStore.getState();
    expect(state.user).toEqual(userData);
    expect(state.accessToken).toEqual(accessToken);
    expect(state.refreshToken).toEqual(refreshToken);
    expect(state.loading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith(`Welcome back, ${userData.firstName}!`);
    expect(axios.post).toHaveBeenCalledWith("/api/v1/auth/signin", {
      email: "login@example.com",
      password: "abc123",
    });
  });

  it("shows error toast and does not set user on failed login (message)", async () => {
    const errorMessage = "Invalid credentials";
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });
    await useUserStore.getState().login("login@example.com", "wrongpassword");
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(axios.post).toHaveBeenCalledWith("/api/v1/auth/signin", {
      email: "login@example.com",
      password: "wrongpassword",
    });
  });

  it("shows error toast and does not set user on failed login (error)", async () => {
    const errorMessage = "User not found";
    axios.post.mockRejectedValueOnce({
      response: {
        data: { error: errorMessage },
      },
    });
    await useUserStore.getState().login("missing@example.com", "badpass");
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("handles empty response gracefully (no data returned)", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await useUserStore.getState().login("empty@example.com", "abc123");
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.loading).toBe(false);
    // Without a user object, the store cannot derive a firstName to personalize the toast.
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe("useUserStore - logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.setState({
      user: { id: 99, firstName: "Test", lastName: "User" },
      accessToken: "oldAccess",
      refreshToken: "oldRefresh",
      loading: false,
      checkingAuth: false,
    });
  });

  it("clears user and tokens and shows success toast on logout when refresh token exists", async () => {
    axios.post.mockResolvedValueOnce({});
    await useUserStore.getState().logout();
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Logged out successfully!");
    expect(axios.post).toHaveBeenCalledWith("/api/v1/auth/signout", {
      refreshToken: "oldRefresh",
    });
  });

  it("clears auth and shows toast without calling backend when refresh token is missing", async () => {
    // Set up a store state without a refresh token
    useUserStore.setState({
      user: { id: 1, firstName: "No", lastName: "Token" },
      accessToken: "someAccess",
      refreshToken: null,
      loading: false,
      checkingAuth: false,
    });
    await useUserStore.getState().logout();
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Logged out successfully!");
    expect(axios.post).not.toHaveBeenCalled();
  });
});

describe("useUserStore - checkAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      checkingAuth: true,
    });
  });

  it("keeps existing user and clears checkingAuth when tokens exist", async () => {
    // Initialize store with a user and valid tokens
    const existingUser = { id: 10, firstName: "Auth", lastName: "User" };
    useUserStore.setState({
      user: existingUser,
      accessToken: "access",
      refreshToken: "refresh",
      checkingAuth: true,
    });
    await useUserStore.getState().checkAuth();
    const state = useUserStore.getState();
    // checkAuth should not override the existing user when tokens are present
    expect(state.user).toEqual(existingUser);
    expect(state.checkingAuth).toBe(false);
    // checkAuth no longer calls axios.get; it simply inspects tokens
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("clears user and sets checkingAuth false when tokens are absent", async () => {
    // Start with a user but no tokens
    useUserStore.setState({
      user: { id: 20, firstName: "Old", lastName: "User" },
      accessToken: null,
      refreshToken: null,
      checkingAuth: true,
    });
    await useUserStore.getState().checkAuth();
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.checkingAuth).toBe(false);
    expect(axios.get).not.toHaveBeenCalled();
  });
});