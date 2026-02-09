/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}notificaions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // backend response (data: [...])
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

// ✅ Mark Notifications as Read
export const markNotificationsRead = createAsyncThunk(
  "notifications/markRead",
  async (ids, thunkAPI) => {
    // ids array pass karenge
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.post(
        `${HTTPURL}read-notifications`,
        { ids }, // payload me object ke andar bhejenge
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${HTTPURL}notifications/clear-all`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const clearNotificationsByIds = createAsyncThunk(
  "notifications/clearByIds",
  async (ids, { rejectWithValue, getState }) => {
    const token = getState()?.auth?.token;
    try {
      const res = await axios.post(
        `${HTTPURL}notifications/clear-by-ids`,
        { ids }, // payload: { ids: [...] }
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
