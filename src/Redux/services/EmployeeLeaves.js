/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

export const addOrUpdateLeave = createAsyncThunk(
  "add-or-update-leave",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      // For employee leaves, we always use the same endpoint
      // The backend determines if it's an update or add based on the presence of ID
      let config = {
        method: "post",
        url: `${HTTPURL}add-or-update-leave`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "delete-leave",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}delete-leave`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const getLeaves = createAsyncThunk(
  "/get-leaves",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;
      let config = {
        method: "get",
        url: `${HTTPURL}get-leaves`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const getAllLeaves = createAsyncThunk(
  "/get-all-leaves",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      const token = state?.auth?.token;
      let config = {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        url: `${HTTPURL}get-all-leaves`,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const deleteLeaveAdmin = createAsyncThunk(
  "admin-delete-leave",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "delete",
        url: `${HTTPURL}admin-delete-leave/${id}`, // pass ID in URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const updateLeave = createAsyncThunk(
  "update-leave",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "put",
        url: `${HTTPURL}update-leave`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

export const adminAddLeave = createAsyncThunk(
  "addLeave",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}add-leave`, // backend route for admin
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getLeaveById = createAsyncThunk(
  "leave/getLeaveById",
  async ({ userId, employeeId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const token = thunkAPI.getState()?.user?.token;
      if (!token) {
        return rejectWithValue("No auth token found");
      }

      const config = {
        method: "get",
        url: `${HTTPURL}get-leaves-ById`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(userId && { userId }),
          ...(employeeId && { employeeId }),
        },
      };

      const res = await axios.request(config);

      if (res?.data?.status) {
        return res.data.data;
      } else {
        return rejectWithValue(res?.data?.message || "Failed to fetch leave");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
export const updateLeaveStatus = createAsyncThunk(
  "leave/updateStatus",
  async ({ id, status }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "put",
        url: `${HTTPURL}update-leave-status`, // 👈 backend route
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id, status }, // 👈 payload
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to update leave status"
      );
    }
  }
);
