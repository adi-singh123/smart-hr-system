/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ============================
// 🟢 Get All Shift Rosters
// ============================
export const get_all_shift_rosters = createAsyncThunk(
  "shiftRoster/all",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}sift-rosters`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken,
        },
      };

      const response = await axios.request(config);
      return response.data; // {success, message, data}
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Add Shift Roster
// ============================
export const add_shift_roster = createAsyncThunk(
  "shiftRoster/add",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "post",
        url: `${HTTPURL}sift-rosters`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken,
        },
        data: formData,
      };

      const res = await axios.request(config);

      if (res?.data?.success) customAlert(res.data.message, "success");
      else customAlert(res.data.message);

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Update Shift Roster
// ============================
export const update_shift_roster = createAsyncThunk(
  "shiftRoster/update",
  async ({ id, formData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "put",
        url: `${HTTPURL}sift-rosters/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken,
        },
        data: formData,
      };

      const res = await axios.request(config);

      if (res?.data?.success) customAlert(res.data.message, "success");
      else customAlert(res.data.message);

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ============================
// 🟢 Delete Shift Roster
// ============================
export const delete_shift_roster = createAsyncThunk(
  "shiftRoster/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const res = await axios.delete(`${HTTPURL}sift-rosters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) customAlert(res.data.message, "success");
      else customAlert(res.data.message);

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
