import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// 🔁 Create Invoice
export const createInvoice = createAsyncThunk(
  "create-invoice",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "post",
        url: `${HTTPURL}invoices`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

// 🔄 Update Invoice
export const updateInvoice = createAsyncThunk(
  "update-invoice",
  async ({ id, data }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "put",
        url: `${HTTPURL}invoices/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

// 📥 Get All Invoices
export const fetchInvoices = createAsyncThunk(
  "fetch-invoices",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "get",
        url: `${HTTPURL}invoices`,
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

// 📄 Get Invoice by ID
export const fetchInvoiceById = createAsyncThunk(
  "fetch-invoice-by-id",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "get",
        url: `${HTTPURL}invoices/${id}`,
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


// ❌ Missing — let's add it:
export const deleteInvoice = createAsyncThunk(
  "delete-invoice",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;

      const config = {
        method: "delete",
        url: `${HTTPURL}invoices/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
