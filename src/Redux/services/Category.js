import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const HTTPURL = 'http://localhost:3001/api/'

// get categories
export const getCategories = createAsyncThunk(
  "get-categories",
  async () => {
    try {
      let config = {
        method: "get",
        url: `${HTTPURL}get-categories`,
      };
      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      return error?.response?.data

    }
  }
);

//get subcategories
export const getSubCategories = createAsyncThunk(
  "/get-subcategories",
  async () => {
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}get-subcategories`,
      };
      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      return error?.response?.data

    }
  }
);

export const getChildSubCategories = createAsyncThunk(
  "/get-child-sub-categories",
  async () => {
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}get-child-sub-categories`,
      };
      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      return error?.response?.data

    }
  }
);
//add category
export const addCategory = createAsyncThunk(
  "add-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}add-category`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        data: formData,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);

// add subcategory
export const addSubCategory = createAsyncThunk(
  "add-subcategory",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}add-subcategory`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);

export const addChildSubCategory = createAsyncThunk(
  "add-child-sub-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token =  state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}add-child-sub-category`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "delete-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token =  state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}delete-category`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);

export const editCategory = createAsyncThunk(
  "edit-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token =  state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}edit-category`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);
export const editSubCategory = createAsyncThunk(
  "edit-sub-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}edit-sub-category`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);

export const editChildSubCategory = createAsyncThunk(
  "edit-child-sub-category",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token =  state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}edit-child-sub-category`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error?.response?.data
    }
  }
);