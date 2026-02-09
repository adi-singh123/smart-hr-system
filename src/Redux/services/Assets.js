import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher"; // adjust if path differs

// 📥 Get All Assets
export const fetchAssets = createAsyncThunk(
  "assets/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.auth?.token;
      const { data } = await axios.get(`${HTTPURL}assets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📄 Get Asset by ID
export const fetchAssetById = createAsyncThunk(
  "assets/fetchById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.auth?.token;
      const { data } = await axios.get(`${HTTPURL}assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔁 Create Asset
export const createAsset = createAsyncThunk(
  "assets/create",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.auth?.token;
      const { data } = await axios.post(`${HTTPURL}assets`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔄 Update Asset
export const updateAsset = createAsyncThunk(
  "assets/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.auth?.token;
      const { data } = await axios.put(`${HTTPURL}assets/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ❌ Delete Asset
export const deleteAsset = createAsyncThunk(
  "assets/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.auth?.token;
      const { data } = await axios.delete(`${HTTPURL}assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...data, deletedId: id };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
