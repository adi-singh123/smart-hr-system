/** @format */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher"; // adjust your base URL
import { customAlert } from "../../utils/Alert";
const BASE_URL = `${HTTPURL}/trainings`;
export const getTrainings = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data; // { success, message, data }
  } catch (err) {
    console.error("Error fetching trainings:", err);
    throw err;
  }
};

export const addTraining = async (payload) => {
  try {
    const res = await axios.post(BASE_URL, payload);
    return res.data;
  } catch (err) {
    console.error("Error adding training:", err);
    throw err;
  }
};

export const updateTraining = async (id, payload) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating training:", err);
    throw err;
  }
};

export const deleteTraining = createAsyncThunk(
  "raining/deleteTraining",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      let config = {
        method: "delete",
        url: `${HTTPURL}trainings/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
        },
      };

      const res = await axios.request(config);
      console.log("response", res);
      if (res?.data?.success === true) {
        customAlert(
          res?.data?.message || "Holiday deleted successfully!",
          "success"
        );
      } else {
        customAlert(res?.data?.message || "Failed to delete holiday");
      }

      return res.data;
    } catch (error) {
      customAlert(error?.response?.data?.message || error?.message);
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
