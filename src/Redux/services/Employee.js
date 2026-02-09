/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// add employee
export const Add_employee = createAsyncThunk(
  "/api/add-employee",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    const { rejectWithValue } = thunkAPI;
    try {
      let config = {
        method: "Post",
        url: `${HTTPURL}add-user`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
        data: formData,
      };
      const res = await axios.request(config);
      if (res?.data?.status == true) {
        // Ensure success message is shown with proper styling
        customAlert(res?.data?.message, "success"); // ✅ success -> green
        // Dispatch get_employee_data to refresh the list
        thunkAPI.dispatch(get_employee_data());
        return res.data;
      } else {
        customAlert(res?.data?.message); // ❌ error -> red
        return rejectWithValue(res?.data?.message);
      }
    } catch (error) {
      const errorMsg = error?.response?.data
        ? error?.response?.data?.message
        : error?.message;
      customAlert(errorMsg); // ❌ red
      return rejectWithValue(errorMsg);
    }
  }
);

// get employee
export const get_employee_data = createAsyncThunk(
  "api/all-employee",
  async (params = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await axios.get(`${HTTPURL}all-users`, {
        params, // ⬅ page, list_data yahi jayenge
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: refreshToken,
        },
      });

      return response.data; // backend ka pure response
    } catch (error) {
      customAlert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

// edit employee data
export const edit_employee_data = createAsyncThunk(
  "api/edit-employee",
  async (employeeData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const config = {
        method: "Post",
        url: `${HTTPURL}edit-user`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
        data: employeeData,
      };

      const response = await axios.request(config);
      if (response?.data?.status === true) {
        customAlert(response?.data?.message, "success"); // ✅ green
        thunkAPI.dispatch(get_employee_data());
      } else {
        customAlert(response?.data?.message); // ❌ red
      }
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      ); // ❌ red
    }
  }
);

// get my profile
export const get_my_profile = createAsyncThunk(
  "api/get-my-profile",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}get-my-profile?userId=${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      ); // ❌ red
    }
  }
);

// get client data
export const get_client_data = createAsyncThunk(
  "api/get-client-data",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const config = {
        method: "get",
        url: `${HTTPURL}get-client-data`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };
      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      ); // ❌ red
    }
  }
);

// delete employee
export const delete_employee = createAsyncThunk(
  "/api/delete-employee",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}deleteuser/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };

      const res = await axios.request(config);
      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success"); // ✅ green
        thunkAPI.dispatch(get_employee_data());
      } else {
        customAlert(res?.data?.message || "Something went wrong"); // ❌ red
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      ); // ❌ red
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// get user id
export const get_user_id = createAsyncThunk(
  "api/get-my-profile",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}getuserid`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      ); // ❌ red
    }
  }
);
