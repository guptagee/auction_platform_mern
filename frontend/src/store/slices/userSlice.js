import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api.js";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutRequest(state, action) {
      state.loading = true;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutFailed(state, action) {
      state.loading = false;
    },
    fetchUserRequest(state, action) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    updateProfileRequest(state, action) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
    },
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state, action) {
      state.leaderboard = state.leaderboard;
      state.loading = false;
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      API_ENDPOINTS.USER_REGISTER,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    console.log("🚀 Sending login request with data:", data);
    const response = await axios.post(
      API_ENDPOINTS.USER_LOGIN,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("✅ Login response:", response.data);
    dispatch(userSlice.actions.loginSuccess(response.data.user));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response?.data?.message || "Login failed");
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const logout = () => async (dispatch) => {
  console.log("Logout function called");
  dispatch(userSlice.actions.logoutRequest());
  try {
    console.log("Making logout API call...");
    await axios.get(API_ENDPOINTS.USER_LOGOUT, {
      withCredentials: true,
    });
    console.log("Logout API call successful");
    
    // Clear all user-related state
    dispatch(userSlice.actions.logoutSuccess());
    
    // Clear any other related state (if needed)
    // dispatch(clearAllErrors());
    
    toast.success("Logged out successfully");
    
    // Force a page reload to clear any cached state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(userSlice.actions.logoutFailed());
    toast.error("Logout failed");
    
    // Even if API call fails, clear local state
    dispatch(userSlice.actions.logoutSuccess());
    
    // Force redirect to home page
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(API_ENDPOINTS.USER_PROFILE, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export const updateProfile = (data) => async (dispatch) => {
  dispatch(userSlice.actions.updateProfileRequest());
  try {
    const response = await axios.put(
      API_ENDPOINTS.USER_UPDATE_PROFILE,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.updateProfileSuccess(response.data.user));
    toast.success("Profile updated successfully!");
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.updateProfileFailed());
    toast.error(error.response?.data?.message || "Failed to update profile");
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(API_ENDPOINTS.USER_LEADERBOARD, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export const { clearAllErrors } = userSlice.actions;
export default userSlice.reducer;
