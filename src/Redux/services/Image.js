/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// add images
export const addImages = createAsyncThunk(
  "upload-image",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}upload-image`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

//get images
export const getImages = createAsyncThunk("welcome-images", async () => {
  try {
    let config = {
      method: "get",
      url: `${HTTPURL}welcome-images`,
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
});

// update image
export const updateImage = createAsyncThunk(
  "update-image",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "put",
        url: `${HTTPURL}update-image`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);

//delete image
export const deleteImage = createAsyncThunk(
  "delete-image",
  async (id, thunkAPI) => {
    // id directly pass
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const response = await axios.delete(`${HTTPURL}delete-image/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);
