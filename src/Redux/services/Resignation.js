/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Fetch all resignations
export const get_resignations = createAsyncThunk(
  "resignation/get_resignations",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}resignation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      customAlert(msg.message || "Failed to fetch resignations", "error");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Add or update resignation
export const add_update_resignation = createAsyncThunk(
  "resignation/add_update_resignation",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      let response;
      if (formData?.id) {
        response = await axios.put(
          `${HTTPURL}resignation/${formData.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(`${HTTPURL}resignation`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };

      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Get resignation by ID (for edit/preview)
export const edit_resignation = createAsyncThunk(
  "resignation/edit_resignation",
  async (id, thunkAPI) => {
    const token =
      thunkAPI.getState()?.auth?.token || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${HTTPURL}resignation/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      const msg = error?.response?.data || {
        success: false,
        message: error.message,
      };
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// ✅ Delete resignation
export const delete_resignation = createAsyncThunk(
  "resignation/delete_resignation",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.delete(`${HTTPURL}resignation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.success || response?.data?.status) {
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
      customAlert(msg.message || "Failed to delete resignation", "error");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);
