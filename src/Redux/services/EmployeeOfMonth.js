/** @format */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Add Employee of the Month
export const addEmployeeOfMonth = createAsyncThunk(
  "employeeOfMonth/add",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.post(
        `${HTTPURL}employee-of-the-month`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

// ✅ Update Employee of the Month
export const updateEmployeeOfMonth = createAsyncThunk(
  "employeeOfMonth/update",
  async ({ id, formData }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.put(
        `${HTTPURL}employee-of-the-month/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

// ✅ Fetch All Employee of the Month records
export const fetchEmployeeOfMonths = createAsyncThunk(
  "employeeOfMonth/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}employee-of-the-month`, {
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

// ✅ Fetch Single Employee of the Month by ID
export const fetchEmployeeOfMonthById = createAsyncThunk(
  "employeeOfMonth/fetchById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(
        `${HTTPURL}employee-of-the-month/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

// ✅ Delete Employee of the Month
export const deleteEmployeeOfMonth = createAsyncThunk(
  "employeeOfMonth/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.delete(
        `${HTTPURL}employee-of-the-month/${id}`,
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
