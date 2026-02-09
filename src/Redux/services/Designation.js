/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

//get designation
export const get_all_active_designation = createAsyncThunk(
  "api/all-active-designation",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}all-active-designation?department_id=${id}`,
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
      );
    }
  }
);

// add designation
export const Add_designation = createAsyncThunk(
  "/api/add-designation",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      // agar designation_id khali object ya null hai, to hata do
      const payload = { ...formData };
      if (
        !payload.designation_id ||
        Object.keys(payload.designation_id).length === 0
      ) {
        delete payload.designation_id;
      }

      let config = {
        method: "post",
        url: `${HTTPURL}add-update-designation`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      };

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// edit degination data
export const edit_designation_data = createAsyncThunk(
  "api/edit-designation",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}edit-designation?id=${id}`,
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
      );
    }
  }
);

//get department
export const get_designation_data = createAsyncThunk(
  "api/all-designations",
  async (SearchData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}all-designations`,
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
      );
    }
  }
);
//delete
//delete
export const delete_designation = createAsyncThunk(
  "designation/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token; // Redux se token le rahe

    try {
      const response = await axios.delete(`${HTTPURL}designation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token pass kar rahe
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
