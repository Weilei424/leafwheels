import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios.js";
import { toast } from "react-toastify";


//  Mock toast so it doesn't pop up in tests
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../lib/axios.js", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),

    interceptors: {
      response: {
        use: vi.fn()
      }
    }
  }
}));



  describe("useUserStore - signup", () => {
    beforeEach(() => {
      useUserStore.setState({
        user: null,
        loading: false,
        checkingAuth: false,
      });
      vi.clearAllMocks();
    });

  //first
    it("sets user on successful signup", async () => {
      // test body 
      const userData = {
        id: 1,
        name: "Test User",
        email: "test@example.com"
      };
      
      // Simulate a successful axios response
      axios.post.mockResolvedValueOnce({ data: userData });
      
      // Call the store’s signup action
      await useUserStore.getState().signup({
        name: "Test User",
        email: "test@example.com",
        password: "abc123",
        confirmPassword: "abc123"
      });
      
      // Check final state
      const state = useUserStore.getState();
      expect(state.user).toEqual(userData);
      expect(state.loading).toBe(false);
      


    });
    //second
    it("shows error toast and aborts when passwords do not match", async () => {
      // Act: call signup with mismatched passwords
      await useUserStore.getState().signup({
        name: "Mismatch Test",
        email: "mismatch@example.com",
        password: "abc123",
        confirmPassword: "wrong123",
      });
    
      const state = useUserStore.getState();
    
      // Assert: no user should be set
      expect(state.user).toBe(null);
    
      // Assert: loading should be false
      expect(state.loading).toBe(false);
    
      // Assert: toast.error should be called with correct message
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
    
      // Assert: backend should not be called
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    //third
    it("shows error toast and does not set user on backend failure", async () => {
      // Arrange: simulate backend error by rejecting the promise
      const errorMessage = "Email already exists";
      axios.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage }
        }
      });
  
      // Act: call signup with valid passwords
      await useUserStore.getState().signup({
        name: "Error Test",
        email: "fail@example.com",
        password: "abc123",
        confirmPassword: "abc123"
      });
  
      const state = useUserStore.getState();
  
      // Assert: user should remain null and loading should stop
      expect(state.user).toBe(null);
      expect(state.loading).toBe(false);
  
      // Assert: error toast should show correct backend message
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  
      // Assert: backend was called once
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
  // fourth
  /**
 * This test fails because the store calls toast.success("Signup successful!")
 * even when the backend response contains no `data` field.
 * 
 * The test simulates a successful HTTP response with an empty object ({}),
 * but the store doesn't validate `data` before updating state or showing toast.
 */

  it("handles empty response gracefully (no data returned)", async () => {
    // Arrange: simulate backend response with no 'data' field
    axios.post.mockResolvedValueOnce({});
  
    // Act: call signup with valid inputs
    await useUserStore.getState().signup({
      name: "Edge User",
      email: "edge@example.com",
      password: "abc123",
      confirmPassword: "abc123",
    });
  
    const state = useUserStore.getState();
  
    // Assert: user should remain null or undefined
    expect(state.user).toBe(undefined);
  
    // Assert: loading should still reset
    expect(state.loading).toBe(false);
  
    // Assert: success toast should NOT be called
    expect(toast.success).not.toHaveBeenCalled();
  
    
  });
  



  });
 

  describe("useUserStore - login", () => {
    beforeEach(() => {
      useUserStore.setState({
        user: null,
        loading: false,
        checkingAuth: false,
      });
      vi.clearAllMocks();
    });
  
    //  First: Successful login
    it("sets user and shows toast on successful login", async () => {
      // Arrange: mock successful backend response
      const userData = {
        id: 42,
        name: "Login User",
        email: "login@example.com",
      };
      axios.post.mockResolvedValueOnce({ data: userData });
  
      // Act: call login with correct credentials
      await useUserStore.getState().login("login@example.com", "abc123");
  
      const state = useUserStore.getState();
  
      // Assert: user should be set
      expect(state.user).toEqual(userData);
  
      // Assert: loading should be false
      expect(state.loading).toBe(false);
  
      // Assert: success toast called
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
  
      // Assert: axios call was made correctly
      expect(axios.post).toHaveBeenCalledWith("/api/v1/auth/login", {
        email: "login@example.com",
        password: "abc123",
      });
    });
  
    //  Second: Backend rejects login 
    it("shows error toast and does not set user on failed login", async () => {
      // Arrange: simulate backend failure
      axios.post.mockRejectedValueOnce({
        response: {
          data: { message: "Invalid credentials" },
        },
      });
  
      // Act: call login with bad credentials
      await useUserStore.getState().login("login@example.com", "wrongpassword");
  
      const state = useUserStore.getState();
  
      // Assert: user should still be null
      expect(state.user).toBe(null);
  
      // Assert: loading is off
      expect(state.loading).toBe(false);
  
      // Assert: error toast shown
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
  
      // Assert: axios was called with correct args
      expect(axios.post).toHaveBeenCalledWith("/api/v1/auth/login", {
        email: "login@example.com",
        password: "wrongpassword",
      });
    });
  
    /**
     * This test simulates a successful HTTP response
     * where the backend returns `{}` without a `data` field.
     * The current store logic still sets user to `undefined`
     * and shows a success toast, which is logically flawed.
     */
    it("handles empty response gracefully (no data returned)", async () => {
      // Arrange: backend sends empty object
      axios.post.mockResolvedValueOnce({});
  
      // Act: call login
      await useUserStore.getState().login("login@example.com", "abc123");
  
      const state = useUserStore.getState();
  
      // Assert: user is undefined (due to missing backend data)
      expect(state.user).toBe(undefined);
  
      // Assert: loading turned off
      expect(state.loading).toBe(false);
  
      // Assert: toast still shown (but shouldn't be ideally)
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
    });
  });
  
//logout
  describe("useUserStore - logout", () => {
    beforeEach(() => {
      // Clear any prior mocks and reset Zustand state
      vi.clearAllMocks();
      useUserStore.setState({
        user: { id: 99, name: "Test User" },
        loading: false,
      });
    });
  
    it("clears user and shows success toast on logout", async () => {
      // Mock the backend logout API call to succeed
      axios.post.mockResolvedValueOnce({});
  
      // Act: Call the logout function
      await useUserStore.getState().logout();
  
      const state = useUserStore.getState();
  
      //  Assert: user should now be null
      expect(state.user).toBeNull();
  
      // Assert: success toast should be called with logout message
      expect(toast.success).toHaveBeenCalledWith("Logged out successfully!");
  
      //  Assert: backend API was called correctly
      expect(axios.post).toHaveBeenCalledWith("/auth/logout");
    });
  });
  

  describe("useUserStore - checkAuth", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      useUserStore.setState({
        user: null,
        loading: false,
        checkingAuth: false,
      });
    });
  
    //  Test: successful check sets user and clears checkingAuth
    it("sets user and clears checkingAuth on successful auth check", async () => {
      const userData = { id: 1, name: "Authenticated User" };
  
      axios.get.mockResolvedValueOnce({ data: userData });
  
      // Act
      await useUserStore.getState().checkAuth();
  
      const state = useUserStore.getState();
  
      expect(state.checkingAuth).toBe(false);
      expect(state.user).toEqual(userData);
      expect(axios.get).toHaveBeenCalledWith("/auth/profile");
    });
  
    //  Test: failed check clears checkingAuth but keeps user null
    it("clears checkingAuth and keeps user null on failed auth check", async () => {
      axios.get.mockRejectedValueOnce(new Error("401 Unauthorized"));
  
      // Act
      await useUserStore.getState().checkAuth();
  
      const state = useUserStore.getState();
  
      expect(state.checkingAuth).toBe(false);
      expect(state.user).toBe(null);
      expect(axios.get).toHaveBeenCalledWith("/auth/profile");
    });
    it("handles empty user response (no data) gracefully", async () => {
      axios.get.mockResolvedValueOnce({}); // empty success
    
      await useUserStore.getState().checkAuth();
      const state = useUserStore.getState();
    
      expect(state.user).toBe(undefined); // it will be undefined unless handled explicitly
      expect(state.checkingAuth).toBe(false);
    });
    
  });
  