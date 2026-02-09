import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

// Add Event
export const Add_event = createAsyncThunk(
  "/api/add-event",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const res = await axios.post(`${HTTPURL}events`, formData, {
        headers: { Authorization: `Bearer ${token}`, refreshToken },
      });

      // inside Add_event
      if (res?.data?.status) {
          customAlert(res?.data?.message, "success");
        thunkAPI.dispatch(get_all_events());
        return res.data;
      } else {
        customAlert(res?.data?.message || "Something went wrong", "error"); 
        return thunkAPI.rejectWithValue(res?.data?.message);
      }

    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || "Something went wrong";
      customAlert(errorMsg,"error");
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Get All Events
export const get_all_events = createAsyncThunk(
  "/api/all-events",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const res = await axios.get(`${HTTPURL}events`, {
        headers: { Authorization: `Bearer ${token}`, refreshToken },
      });
      return res.data;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || "Something went wrong";
      customAlert(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);
// edit
export const edit_event = createAsyncThunk(
  "/api/edit-event",
  async (eventData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      // The id is extracted from the single eventData object
      const { id, ...formData } = eventData;
      
      // Changed from axios.put to axios.post to match the backend controller
      const res = await axios.put(`${HTTPURL}events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, refreshToken },
      });

      if (res?.data?.status) {
        customAlert(res?.data?.message, "success");
        thunkAPI.dispatch(get_all_events());
        return res.data;
      } else {
        customAlert(res?.data?.message);
        return thunkAPI.rejectWithValue(res?.data?.message);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || "Something went wrong";
      customAlert(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Delete Event
export const delete_event = createAsyncThunk(
  "/api/delete-event",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const res = await axios.delete(`${HTTPURL}events/${id}`, {
        headers: { Authorization: `Bearer ${token}`, refreshToken },
      });

      if (res?.data?.status) {
        customAlert(res?.data?.message, "success");
        thunkAPI.dispatch(get_all_events());
        return res.data;
      } else {
        customAlert(res?.data?.message || "Something went wrong");
        return thunkAPI.rejectWithValue(res?.data?.message);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || "Something went wrong";
      customAlert(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);