import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

const getToken = (thunkAPI) => thunkAPI.getState()?.auth?.token;


// 🔁 Create
export const createPerformanceOrganization = createAsyncThunk(
  "create-performance-organization",
  async (formData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.post(`${HTTPURL}organizations`, formData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 🔄 Update
export const updatePerformanceOrganization = createAsyncThunk(
  "update-performance-organization",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.put(`${HTTPURL}organizations/${id}`, data, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 📥 Get All
export const fetchPerformanceOrganizations = createAsyncThunk(
  "fetch-performance-organizations",
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.get(`${HTTPURL}organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchPerformanceOrganizationById = createAsyncThunk(
  "fetch-performance-Organization-by-id",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI); // same helper you’re using
      const response = await axios.get(`${HTTPURL}organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ❌ Delete
export const deletePerformanceOrganization = createAsyncThunk(
  "delete-performance-organization",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.delete(`${HTTPURL}organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
