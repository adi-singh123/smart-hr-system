/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Punch API (updated to auto-refresh break hours after punch)
export const punch = createAsyncThunk("punch", async (formData, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state?.auth?.token;
  try {
    const config = {
      method: "post",
      url: `${HTTPURL}punch`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };

    const response = await axios.request(config);

    // ✅ Auto-fetch break hours after punch (for instant UI update)
    await thunkAPI.dispatch(getBreakHours());

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data);
  }
});

// ✅ Get Punch Data
export const getPunchData = createAsyncThunk(
  "/get-punch-data",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "get",
        url: `${HTTPURL}get-punch-data`,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ✅ Get All Punch Data
export const getAllPunchData = createAsyncThunk(
  "/get-all-punch-data",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "get",
        url: `${HTTPURL}get-all-punch-data`,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ✅ Get Punch Type
export const getPunchType = createAsyncThunk(
  "/get-punch-type",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "get",
        url: `${HTTPURL}get-punch-type`,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ✅ Get Break Hours (unchanged, just standardized error handling)
export const getBreakHours = createAsyncThunk(
  "/get-break-hours",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "get",
        url: `${HTTPURL}get-break-hours`,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);


// ✅ Get Weekly Working Hours for Chart
export const getWorkingHours = createAsyncThunk(
  "/get-working-hours",
  async (employeeId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "get",
        url: `${HTTPURL}/working-hours/${employeeId}`,
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.request(config);
      return response.data; // expected: { success: true, data: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);


