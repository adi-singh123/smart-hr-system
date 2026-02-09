/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// 🔹 Get all holidays
export const get_holidays = createAsyncThunk(
  "holiday/get-all",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}get-holidays`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data?.message ||
          error?.message ||
          "Error fetching holidays"
      );
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Add Holiday
// Holiday.js (Redux services)
export const add_holiday = createAsyncThunk(
  "holiday/add",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}add-holiday`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
          "Content-Type": "application/json",
        },
        data: formData, // ✅ direct object, not wrapped in { data: formData }
      };

      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 🔹 Update Holiday
export const update_holiday = createAsyncThunk(
  "holiday/update",
  async ({ id, formData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const res = await axios.put(
        `${HTTPURL}update-holiday/${id}`,
        formData, // ✅ direct send
        {
          headers: {
            Authorization: `Bearer ${token}`,
            refreshToken: refreshToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.status === true) {
        customAlert(
          res?.data?.message || "Holiday updated successfully!",
          "success"
        );
      } else {
        customAlert(res?.data?.message || "Failed to update holiday");
      }

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error?.message);
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 🔹 Delete Holiday
export const delete_holiday = createAsyncThunk(
  "holiday/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "delete",
        url: `${HTTPURL}delete-holiday/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };

      const res = await axios.request(config);
      if (res?.data?.status === true) {
        customAlert(
          res?.data?.message || "Holiday deleted successfully!",
          "success"
        );
      } else {
        customAlert(res?.data?.message || "Failed to delete holiday");
      }

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error?.message);
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
