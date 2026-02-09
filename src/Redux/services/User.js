/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

/* ===========================
   AXIOS REQUEST INTERCEPTOR
   =========================== */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   AXIOS RESPONSE INTERCEPTOR
   =========================== */
   
let isLock = false; // Prevents notification spam

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    // Trigger only if status is 401 and we haven't started the logout process yet
    if (status === 401 && !isLock) {
      isLock = true; // Lock the interceptor

      // Show exactly one alert
      customAlert(message || "Unauthorized", "error");

      // Stop any background logic and redirect
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/";
        // We don't reset isLock because the page is reloading/redirecting
      }, 1500);

      // Return an empty promise to silence Redux Thunk "rejectWithValue" alerts
      return new Promise(() => {}); 
    }

    return Promise.reject(error);
  }
);

/* ===========================
   USERS
   =========================== */
export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${HTTPURL}all-users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);

/* ===========================
   AUTH
   =========================== */
export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(`${HTTPURL}login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.status === true) {
        localStorage.setItem("loginUserId", res.data.data.id);
        localStorage.setItem(
          "LoggedInEmployeeId",
          res.data.data.employee_id
        );
        localStorage.setItem("setupTime", Date.now().toString());

        customAlert(res.data.message, "success");
        return res.data;
      } else {
        customAlert(res?.data?.message);
        return rejectWithValue(res?.data?.message || "Invalid credentials");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Login failed";
      customAlert(msg);
      return rejectWithValue(msg);
    }
  }
);

export const VerifyOtp = createAsyncThunk(
  "auth/otp-verify",
  async (formData) => {
    try {
      const res = await axios.post(`${HTTPURL}otp-verify`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.status) {
        localStorage.setItem("token", res.data.data.token);
        customAlert(res.data.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data?.message || error?.message
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forget-password",
  async (formData) => {
    try {
      const res = await axios.post(`${HTTPURL}forget-password`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      res?.data?.status
        ? customAlert(res.data.message, "success")
        : customAlert(res.data.message);

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data?.message || error?.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (formData) => {
    try {
      const res = await axios.post(`${HTTPURL}reset-password`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      res?.data?.status
        ? customAlert(res.data.message, "success")
        : customAlert(res.data.message);

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data?.message || error?.message
      );
    }
  }
);

/* ===========================
   USER DETAILS
   =========================== */
export const getName = createAsyncThunk(
  "user/getName",
  async (userId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`${HTTPURL}get-user`, {
        params: { userId },
      });

      if (res?.data?.status) {
        return res.data.data.fullName;
      }

      return rejectWithValue(
        res?.data?.message || "User not found"
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const getFullUserById = createAsyncThunk(
  "user/getFullUserById",
  async ({ userId, employeeId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(
        `${HTTPURL}get-full-user-by-id`,
        {
          params: {
            ...(userId && { userId }),
            ...(employeeId && { employeeId }),
          },
        }
      );

      if (res?.data?.status) {
        return res.data.data;
      }

      return rejectWithValue(
        res?.data?.message || "Failed to fetch user"
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);