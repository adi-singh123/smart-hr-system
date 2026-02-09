/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// 🔹 Get all internship applications
export const fetchInternshipApplications = createAsyncThunk(
  "internshipForm/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.get(`${HTTPURL}internship-form`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // array
    } catch (error) {
      return (
        error?.response?.data || { success: false, message: error.message }
      );
    }
  }
);

// 🔹 Delete internship application
export const deleteInternshipApplication = createAsyncThunk(
  "internshipForm/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;
    try {
      const response = await axios.delete(`${HTTPURL}internship-form/${id}`, {
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
