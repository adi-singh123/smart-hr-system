import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// -------------------------
// Upload a new file
// -------------------------
export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}files`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);

      return {
        status: true,
        message: "File uploaded successfully",
        data: response.data?.data || null,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: false,
        message: error?.response?.data?.message || error.message,
      });
    }
  }
);

// -------------------------
// Fetch all files
// -------------------------
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "get",
        url: `${HTTPURL}files`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);

      return {
        status: true,
        data: response.data?.data  ||  [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: false,
        message: error?.response?.data?.message || error.message,
      });
    }
  }
);

// -------------------------
// Update a file by ID
// -------------------------
export const updateFile = createAsyncThunk(
  "files/updateFile",
  async ({ id, formData }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "put",
        url: `${HTTPURL}files/${id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);

      return {
        status: true,
        message: "File updated successfully",
        data: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: false,
        message: error?.response?.data?.message || error.message,
      });
    }
  }
);

// -------------------------
// Delete a file by ID
// -------------------------
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "delete",
        url: `${HTTPURL}files/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.request(config);

      return {
        status: true,
        message: "File deleted successfully",
        data: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: false,
        message: error?.response?.data?.message || error.message,
      });
    }
  }
);
