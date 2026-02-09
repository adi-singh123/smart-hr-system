/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Fetch all terminations
export const get_terminations = createAsyncThunk(
  "termination/get_terminations",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}termination`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      customAlert(msg.message || "Failed to fetch terminations", "error");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Add or update termination
export const add_update_termination = createAsyncThunk(
  "termination/add_update_termination",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      let response;
      if (formData?.id) {
        response = await axios.put(
          `${HTTPURL}termination/${formData.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(`${HTTPURL}termination`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response?.data?.status || response?.data?.success) {
        customAlert(response?.data?.message, "success");
      } else {
        customAlert(response?.data?.message || "Operation failed", "error");
      }

      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      customAlert(msg.message || "Failed to add/update termination", "error");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Get termination by ID (for edit/preview)
export const edit_termination = createAsyncThunk(
  "termination/edit_termination",
  async (id, thunkAPI) => {
    const token =
      thunkAPI.getState()?.auth?.token || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${HTTPURL}termination/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ headers go in 3rd param
        }
      );
      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      customAlert(
        msg.message || "Failed to fetch termination details",
        "error"
      );
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Delete termination
export const delete_termination = createAsyncThunk(
  "termination/delete_termination",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.delete(`${HTTPURL}termination/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.success || response?.data?.status) {
        customAlert(response?.data?.message, "success");
        return { id };
      } else {
        customAlert(response?.data?.message || "Delete failed", "error");
        return thunkAPI.rejectWithValue(response?.data);
      }
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      customAlert(msg.message || "Failed to delete termination", "error");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);
