import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

const getToken = (thunkAPI) => thunkAPI.getState()?.auth?.token;




// 🔁 Create
export const createPerformanceTechnical = createAsyncThunk(
  "create-performance-technical",
  async (formData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.post(`${HTTPURL}technicals`, formData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 🔄 Update
export const updatePerformanceTechnical = createAsyncThunk(
  "update-performance-technical",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.put(`${HTTPURL}technicals/${id}`, data, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 📥 Get All
export const fetchPerformanceTechnicals = createAsyncThunk(
  "fetch-performance-technicals",
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.get(`${HTTPURL}technicals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 📄 Get Performance Technical by ID
export const fetchPerformanceTechnicalById = createAsyncThunk(
  "fetch-performance-technical-by-id",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI); // same helper you’re using
      const response = await axios.get(`${HTTPURL}technicals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);


// ❌ Delete
export const deletePerformanceTechnical = createAsyncThunk(
  "delete-performance-technical",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.delete(`${HTTPURL}technicals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
