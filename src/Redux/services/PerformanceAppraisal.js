import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

const getToken = (thunkAPI) => thunkAPI.getState()?.auth?.token;


// 🔁 Create
export const createPerformanceAppraisal = createAsyncThunk(
  "create-performance-appraisal",
  async (formData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.post(`${HTTPURL}appraisals`, formData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// 🔄 Update
export const updatePerformanceAppraisal = createAsyncThunk(
  "update-performance-appraisal",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.put(`${HTTPURL}appraisals/${id}`, data, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// fatch
export const fetchPerformanceAppraisals = createAsyncThunk(
  "fetch-performance-appraisals",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "get",
        url: `${HTTPURL}appraisals`,
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

// 📄 Get by ID
export const fetchPerformanceAppraisalById = createAsyncThunk(
  "fetch-performance-appraisal-by-id",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.get(`${HTTPURL}appraisals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ❌ Delete
export const deletePerformanceAppraisal = createAsyncThunk(
  "delete-performance-appraisal",
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const response = await axios.delete(`${HTTPURL}appraisals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
