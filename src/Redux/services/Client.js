/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Add or Update Client
export const addOrUpdateClient = createAsyncThunk(
  "clients/addOrUpdate",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.post(
        `${HTTPURL}add-or-update-client`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

// ✅ Delete Client
export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.post(`${HTTPURL}delete-client`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

// ✅ Fetch Clients
export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}get-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

// ✅ Fetch New Client ID
export const fetchNewClientId = createAsyncThunk(
  "clients/fetchNewId",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}gen-client-id`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);
// ✅ Fetch Client by ID
export const fetchClientById = createAsyncThunk(
  "clients/fetchById",
  async (clientId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);
