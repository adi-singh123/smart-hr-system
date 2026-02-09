/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// CREATE PROJECT THUNK
export const createProject = createAsyncThunk(
  "/api/create-project",
  async (formData, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}create-project`, // update the endpoint if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");

        return res.data.data;
      } else {
        return rejectWithValue(res?.data?.message || "Project creation failed");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  "/api/fetch-projects",
  async (filterData, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}get-projects`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: filterData,
      };

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        return res.data.data.data;
      } else {
        return rejectWithValue(
          res?.data?.message || "Failed to fetch projects"
        );
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
export const deleteProject = createAsyncThunk(
  "/api/delete-project",
  async (projectId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "DELETE",
        url: `${HTTPURL}delete-project/${projectId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
        return projectId; // Return ID for removal in reducer
      } else {
        return rejectWithValue(res?.data?.message || "Project deletion failed");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
