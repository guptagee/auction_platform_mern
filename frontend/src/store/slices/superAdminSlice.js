import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";
import { API_ENDPOINTS } from "../../config/api.js";

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    loading: false,
    monthlyRevenue: [],
    totalAuctioneers: [],
    totalBidders: [],
    // Add actual user objects
    superAdminUsers: [],
    auctioneerUsers: [],
    bidderUsers: [],
    paymentProofs: [],
    singlePaymentProof: {},
    userCounts: {
      superAdmin: 0,
      auctioneers: 0,
      bidders: 0,
      total: 0
    },
    // User activity tracking
    userActivityLogs: [],
    userActivityPagination: {},
    
    // Platform settings
    platformSettings: {
      commissionRate: 5.0
    },
    securitySettings: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableAuditLog: true
    },
    settingsLoading: false,
    settingsError: null,

  },
  reducers: {
    requestForMonthlyRevenue(state, action) {
      state.loading = true;
      state.monthlyRevenue = [];
    },
    successForMonthlyRevenue(state, action) {
      state.loading = false;
      // Map the backend response to match frontend expectations
      state.monthlyRevenue = action.payload.totalMonthlyRevenue || [];
    },
    failedForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = [];
    },
    requestForAllUsers(state, action) {
      state.loading = true;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    successForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = action.payload.auctioneersArray;
      state.totalBidders = action.payload.biddersArray;
      // Store actual user objects
      state.superAdminUsers = action.payload.superAdminUsers || [];
      state.auctioneerUsers = action.payload.auctioneerUsers || [];
      state.bidderUsers = action.payload.bidderUsers || [];
      state.userCounts = action.payload.userCounts;
    },
    failureForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    requestForPaymentProofs(state, action) {
      state.loading = true;
      state.paymentProofs = [];
    },
    successForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = action.payload;
    },
    failureForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = [];
    },
    requestForDeletePaymentProof(state, action) {
      state.loading = true;
    },
    successForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    failureForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    requestForSinglePaymentProofDetail(state, action) {
      state.loading = true;
      state.singlePaymentProof = {};
    },
    successForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = action.payload;
    },
    failureForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = {};
    },
    requestForUpdatePaymentProof(state, action) {
      state.loading = true;
    },
    successForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    failureForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    requestForAuctionItemDelete(state, action) {
      state.loading = true;
    },
    successForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    failureForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.loading = false;
      state.monthlyRevenue = state.monthlyRevenue;
      state.paymentProofs = state.paymentProofs;
      state.totalAuctioneers = state.totalAuctioneers;
      state.totalBidders = state.totalBidders;
      // Preserve user objects
      state.superAdminUsers = state.superAdminUsers;
      state.auctioneerUsers = state.auctioneerUsers;
      state.bidderUsers = state.bidderUsers;
      state.singlePaymentProof = {};
      state.userCounts = state.userCounts;
    },
    
    // User management actions
    requestForUpdateUser(state, action) {
      state.loading = true;
    },
    successForUpdateUser(state, action) {
      state.loading = false;
      // Update user in the appropriate array
      const updatedUser = action.payload.user;
      const updateUserInArray = (userArray) => {
        const index = userArray.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          userArray[index] = updatedUser;
        }
      };
      
      updateUserInArray(state.superAdminUsers);
      updateUserInArray(state.auctioneerUsers);
      updateUserInArray(state.bidderUsers);
    },
    failureForUpdateUser(state, action) {
      state.loading = false;
    },
    
    requestForDeleteUser(state, action) {
      state.loading = true;
    },
    successForDeleteUser(state, action) {
      state.loading = false;
      // Remove user from all arrays
      const userId = action.payload.userId;
      state.superAdminUsers = state.superAdminUsers.filter(user => user._id !== userId);
      state.auctioneerUsers = state.auctioneerUsers.filter(user => user._id !== userId);
      state.bidderUsers = state.bidderUsers.filter(user => user._id !== userId);
      
      // Update user counts
      if (action.payload.deletedUser.role === "Super Admin") {
        state.userCounts.superAdmin = Math.max(0, state.userCounts.superAdmin - 1);
      } else if (action.payload.deletedUser.role === "Auctioneer") {
        state.userCounts.auctioneers = Math.max(0, state.userCounts.auctioneers - 1);
      } else if (action.payload.deletedUser.role === "Bidder") {
        state.userCounts.bidders = Math.max(0, state.userCounts.bidders - 1);
      }
      state.userCounts.total = Math.max(0, state.userCounts.total - 1);
    },
    failureForDeleteUser(state, action) {
      state.loading = false;
    },
    
    requestForUserActivity(state, action) {
      state.loading = true;
    },
    successForUserActivity(state, action) {
      state.loading = false;
      state.userActivityLogs = action.payload.activityLogs;
      state.userActivityPagination = action.payload.pagination;
    },
    failureForUserActivity(state, action) {
      state.loading = false;
      state.userActivityLogs = [];
      state.userActivityPagination = {};
    },
    
    // Platform Settings reducers
    requestForPlatformSettings(state, action) {
      state.settingsLoading = true;
      state.settingsError = null;
    },
    successForPlatformSettings(state, action) {
      state.settingsLoading = false;
      state.platformSettings = action.payload.settings;
      state.securitySettings = action.payload.securitySettings;
      state.settingsError = null;
    },
    failureForPlatformSettings(state, action) {
      state.settingsLoading = false;
      state.settingsError = action.payload;
    },
    
    requestForUpdatePlatformSettings(state, action) {
      state.settingsLoading = true;
      state.settingsError = null;
    },
    successForUpdatePlatformSettings(state, action) {
      console.log("🔄 Updating Redux state with:", action.payload);
      state.settingsLoading = false;
      state.platformSettings = action.payload.settings;
      state.securitySettings = action.payload.securitySettings;
      state.settingsError = null;
      console.log("✅ New Redux state:", { 
        platformSettings: state.platformSettings, 
        securitySettings: state.securitySettings 
      });
    },
    failureForUpdatePlatformSettings(state, action) {
      state.settingsLoading = false;
      state.settingsError = action.payload;
    },
  },
});

export const getMonthlyRevenue = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForMonthlyRevenue());
  try {
    console.log("🔍 Fetching monthly revenue...");
    const response = await axios.get(
      API_ENDPOINTS.SUPER_ADMIN_MONTHLY_INCOME,
      { withCredentials: true }
    );
    console.log("✅ Monthly revenue response:", response.data);
    dispatch(
      superAdminSlice.actions.successForMonthlyRevenue(
        response.data.totalMonthlyRevenue
      )
    );
  } catch (error) {
    console.error("❌ Error fetching monthly revenue:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch(superAdminSlice.actions.failedForMonthlyRevenue());
    console.error(error.response.data.message);
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForAllUsers());
  try {
    console.log("🔍 Fetching all users...");
    const response = await axios.get(
      API_ENDPOINTS.SUPER_ADMIN_ALL_USERS,
      { withCredentials: true }
    );
    console.log("✅ Users response:", response.data);
    dispatch(superAdminSlice.actions.successForAllUsers(response.data));
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch(superAdminSlice.actions.failureForAllUsers());
    console.error(error.response.data.message);
  }
};

export const getAllPaymentProofs = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForPaymentProofs());
  try {
    console.log("🔍 Fetching payment proofs...");
    const response = await axios.get(
      API_ENDPOINTS.SUPER_ADMIN_ALL_PAYMENT_PROOFS,
      { withCredentials: true }
    );
    console.log("✅ Payment proofs response:", response.data);
    dispatch(
      superAdminSlice.actions.successForPaymentProofs(
        response.data.paymentProofs
      )
    );
  } catch (error) {
    console.error("❌ Error fetching payment proofs:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch(superAdminSlice.actions.failureForPaymentProofs());
    console.error(error.response.data.message);
  }
};

export const deletePaymentProof = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForDeletePaymentProof());
  try {
    const response = await axios.delete(
      API_ENDPOINTS.SUPER_ADMIN_DELETE_PAYMENT_PROOF(id),
      { withCredentials: true }
    );
    dispatch(superAdminSlice.actions.successForDeletePaymentProof());
    dispatch(getAllPaymentProofs());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForDeletePaymentProof());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const getSinglePaymentProofDetail = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForSinglePaymentProofDetail());
  try {
    const response = await axios.get(
      API_ENDPOINTS.SUPER_ADMIN_GET_PAYMENT_PROOF(id),
      { withCredentials: true }
    );
    dispatch(
      superAdminSlice.actions.successForSinglePaymentProofDetail(
        response.data.paymentProofDetail
      )
    );
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForSinglePaymentProofDetail());
    console.error(error.response.data.message);
  }
};

export const updateProofStatus = (id, data) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdatePaymentProof());
  try {
    console.log("🔍 Updating payment proof status:", id, data);
    const response = await axios.put(
      API_ENDPOINTS.SUPER_ADMIN_UPDATE_PAYMENT_PROOF_STATUS(id),
      data,
      { withCredentials: true }
    );
    console.log("✅ Payment proof update response:", response.data);
    dispatch(superAdminSlice.actions.successForUpdatePaymentProof());
    
    // Refresh all related data to ensure consistency
    dispatch(getAllPaymentProofs());
    dispatch(getMonthlyRevenue()); // Refresh revenue data
    
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating payment proof status:", error);
    dispatch(superAdminSlice.actions.failureForUpdatePaymentProof());
    const errorMessage = error.response?.data?.message || "Failed to update payment proof status";
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteAuctionItemAction = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForAuctionItemDelete());
  try {
    const response = await axios.delete(
      API_ENDPOINTS.SUPER_ADMIN_DELETE_AUCTION_ITEM(id),
      { withCredentials: true }
    );
    dispatch(superAdminSlice.actions.successForAuctionItemDelete());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForAuctionItemDelete());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

// User Management Actions
export const updateUser = (userId, userData) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdateUser());
  try {
    console.log("🔍 Updating user:", userId, userData);
    const response = await axios.put(
      API_ENDPOINTS.SUPER_ADMIN_UPDATE_USER(userId),
      userData,
      { withCredentials: true }
    );
    console.log("✅ User update response:", response.data);
    dispatch(superAdminSlice.actions.successForUpdateUser(response.data));
    toast.success(response.data.message);
    
    // Refresh user data to ensure consistency
    dispatch(getAllUsers());
    
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    dispatch(superAdminSlice.actions.failureForUpdateUser());
    const errorMessage = error.response?.data?.message || "Failed to update user";
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForDeleteUser());
  try {
    console.log("🔍 Deleting user:", userId);
    const response = await axios.delete(
      API_ENDPOINTS.SUPER_ADMIN_DELETE_USER(userId),
      { withCredentials: true }
    );
    console.log("✅ User delete response:", response.data);
    dispatch(superAdminSlice.actions.successForDeleteUser({
      userId,
      deletedUser: response.data.deletedUser
    }));
    toast.success(response.data.message);
    
    // Refresh user data to ensure consistency
    dispatch(getAllUsers());
    
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    dispatch(superAdminSlice.actions.failureForDeleteUser());
    const errorMessage = error.response?.data?.message || "Failed to delete user";
    toast.error(errorMessage);
    throw error;
  }
};

export const getUserActivityLogs = (userId, filters = {}) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUserActivity());
  try {
    console.log("🔍 Fetching user activity logs:", userId, filters);
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_ENDPOINTS.SUPER_ADMIN_GET_USER_ACTIVITY(userId)}?${queryParams}`;
    
    const response = await axios.get(url, { withCredentials: true });
    console.log("✅ User activity response:", response.data);
    dispatch(superAdminSlice.actions.successForUserActivity(response.data));
    
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user activity:", error);
    dispatch(superAdminSlice.actions.failureForUserActivity());
    const errorMessage = error.response?.data?.message || "Failed to fetch user activity";
    toast.error(errorMessage);
    throw error;
  }
};

export const createUserActivityLog = (logData) => async (dispatch) => {
  try {
    console.log("🔍 Creating activity log:", logData);
    const response = await axios.post(
      API_ENDPOINTS.SUPER_ADMIN_CREATE_ACTIVITY_LOG,
      logData,
      { withCredentials: true }
    );
    console.log("✅ Activity log created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating activity log:", error);
    const errorMessage = error.response?.data?.message || "Failed to create activity log";
    toast.error(errorMessage);
    throw error;
  }
};

// Get platform settings
export const getPlatformSettings = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForPlatformSettings());
  try {
    console.log("🔍 Fetching platform settings...");
    const response = await axios.get(
      API_ENDPOINTS.SUPER_ADMIN_GET_SETTINGS,
      { withCredentials: true }
    );
    console.log("✅ Platform settings response:", response.data);
    dispatch(superAdminSlice.actions.successForPlatformSettings(response.data));
  } catch (error) {
    console.error("❌ Error fetching platform settings:", error);
    const errorMessage = error.response?.data?.message || "Failed to fetch platform settings";
    dispatch(superAdminSlice.actions.failureForPlatformSettings(errorMessage));
    toast.error(errorMessage);
  }
};

// Update platform settings
export const updatePlatformSettings = (settings, securitySettings) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdatePlatformSettings());
  try {
    console.log("🔍 Updating platform settings...");
    const response = await axios.put(
      API_ENDPOINTS.SUPER_ADMIN_UPDATE_SETTINGS,
      { settings, securitySettings },
      { withCredentials: true }
    );
    console.log("✅ Platform settings update response:", response.data);
    dispatch(superAdminSlice.actions.successForUpdatePlatformSettings(response.data));
    toast.success("Platform settings updated successfully!");
    
    // Refresh settings to ensure frontend has latest data
    console.log("🔄 Refreshing platform settings...");
    dispatch(getPlatformSettings());
    
  } catch (error) {
    console.error("❌ Error updating platform settings:", error);
    const errorMessage = error.response?.data?.message || "Failed to update platform settings";
    dispatch(superAdminSlice.actions.failureForUpdatePlatformSettings(errorMessage));
    toast.error(errorMessage);
  }
};

export const clearAllSuperAdminSliceErrors = () => (dispatch) => {
  dispatch(superAdminSlice.actions.clearAllErrors());
};

export default superAdminSlice.reducer;
