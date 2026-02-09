/** @format */

// src/Redux/services/TaskService.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// ----------------------- CREATE TASK -----------------------
export const createTask = createAsyncThunk(
  "/api/create-task",
  async (formData, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token = getState()?.auth?.token;

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}addTask`, // ✅ endpoint adjust if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };

      const res = await axios.request(config);
      if (res?.data?.status === true) {
        customAlert(
          res?.data?.message || "Task created successfully",
          "success"
        );
        return res.data.data;
      } else {
        return rejectWithValue(res?.data?.message || "Task creation failed");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// ----------------------- FETCH TASKS -----------------------
export const fetchTasks = createAsyncThunk(
  "/api/fetch-tasks",
  async (filterData = {}, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token = getState()?.auth?.token;

    try {
      const config = {
        method: "GET",
        url: `${HTTPURL}getTask`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      if (res?.data?.status === true) {
        return res.data.data || [];
      } else {
        return rejectWithValue(res?.data?.message || "Failed to fetch tasks");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// ----------------------- DELETE TASK -----------------------
export const deleteTask = createAsyncThunk(
  "/api/delete-task",
  async (taskId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token = getState()?.auth?.token;

    try {
      const config = {
        method: "DELETE",
        url: `${HTTPURL}deleteTask/${taskId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      if (res?.data?.status === true) {
        customAlert(
          res?.data?.message || "Task deleted successfully",
          "success"
        );
        return taskId; // reducer me id se task remove karenge
      } else {
        return rejectWithValue(res?.data?.message || "Task deletion failed");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// ----------------------- UPDATE TASK -----------------------
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ taskId, assignees }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const token = getState()?.auth?.token;

    try {
      const res = await axios.put(
        `${HTTPURL}updateTask/${taskId}`,
        { assignees },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.status === true) {
        customAlert(
          res?.data?.message || "Task updated successfully",
          "success"
        );
        return res.data.data;
      } else {
        return rejectWithValue(res?.data?.message || "Task update failed");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
