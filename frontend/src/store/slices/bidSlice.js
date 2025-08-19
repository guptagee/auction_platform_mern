import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api.js";
import { getAuctionDetail } from "./auctionSlice";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
  },
  reducers: {
    bidRequest(state, action) {
      state.loading = true;
    },
    bidSuccess(state, action) {
      state.loading = false;
    },
    bidFailed(state, action) {
      state.loading = false;
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const response = await axios.post(API_ENDPOINTS.BID_PLACE(id), data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id))
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());
    toast.error(error.response.data.message);
  }
};

export default bidSlice.reducer