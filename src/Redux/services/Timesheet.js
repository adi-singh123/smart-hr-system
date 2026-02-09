/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ============================
// 🟢 Get All Timesheets
// ============================
export const get_all_timesheets = createAsyncThunk(
  "timesheet/all",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}timesheet`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Add Timesheet
// ============================
export const add_timesheet = createAsyncThunk(
  "timesheet/add",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "post",
        url: `${HTTPURL}timesheet`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
        data: formData,
      };

      const res = await axios.request(config);

      if (res?.data?.success) {
        customAlert(res.data.message, "success");
      } else {
        customAlert(res.data.message);
      }

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Update Timesheet
// ============================
export const update_timesheet = createAsyncThunk(
  "timesheet/update",
  async ({ timesheet_id, formData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "put",
        url: `${HTTPURL}timesheet/${timesheet_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
        data: formData,
      };

      const res = await axios.request(config);

      if (res?.data?.success) {
        customAlert(res.data.message, "success");
      } else {
        customAlert(res.data.message);
      }

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Delete Timesheet
// ============================
export const delete_timesheet = createAsyncThunk(
  "timesheet/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const response = await axios.delete(`${HTTPURL}timesheet/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.success) {
        customAlert(response.data.message, "success");
      } else {
        customAlert(response.data.message);
      }

      return response.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
