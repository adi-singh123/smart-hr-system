/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Get active departments
export const get_all_active_departments = createAsyncThunk(
  "api/all-active-departments",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.get(`${HTTPURL}all-active-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      });
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
    }
  }
);

// ✅ Add or Update department
export const Add_department = createAsyncThunk(
  "/api/add-department",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const res = await axios.post(
        `${HTTPURL}add-update-department`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.status) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }
      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
    }
  }
);

// ✅ Get all departments
// ✅ Get all departments with pagination
export const get_department_data = createAsyncThunk(
  "api/all-departments",
  async ({ page = 1, list_data = 10 } = {}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.get(
        `${HTTPURL}all-departments?page=${page}&list_data=${list_data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            refreshToken: `${refreshToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
    }
  }
);

// ✅ Get department by ID for editing
export const edit_department_data = createAsyncThunk(
  "api/edit-department",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.get(`${HTTPURL}edit-department?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      });
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
    }
  }
);

// ✅ Delete department
export const deleteDepartment = createAsyncThunk(
  "department/delete",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await axios.delete(`${HTTPURL}department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken,
        },
      });

      // ✅ backend "success" भेज रहा है, "status" नहीं
      if (res?.data?.success) {
        customAlert(res?.data?.message, "success");
        return { id }; // 👈 सिर्फ id return कर
      } else {
        customAlert(res?.data?.message, "error");
        return thunkAPI.rejectWithValue(res?.data?.message);
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message;
      customAlert(errMsg, "error");
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const getDepartmentById = createAsyncThunk(
  "department/getDepartmentById",
  async ({ id, employee_id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token) {
        return thunkAPI.rejectWithValue("No auth token found");
      }

      const res = await axios.get(`${HTTPURL}get-department-by-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken,
        },
        params: { id, employee_id },
      });

      if (res?.data?.status) {
        return res.data.data; // ✅ department object
      } else {
        return thunkAPI.rejectWithValue(
          res?.data?.message || "Failed to fetch department"
        );
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Unknown error";
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);
