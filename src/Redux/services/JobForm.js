/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// 🔹 Get all job applications
export const fetchJobApplications = createAsyncThunk(
  "jobForm/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}job-form`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return error?.response?.data || { success: false, message: error.message };
    }
  }
);

// 🔹 Delete job application
export const deleteJobApplication = createAsyncThunk(
  "jobForm/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.delete(`${HTTPURL}job-form/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return error?.response?.data || { success: false, message: error.message };
    }
  }
);
