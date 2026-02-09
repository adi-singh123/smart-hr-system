/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher";

// ✅ Add or Update Promotion
export const addOrUpdatePromotion = createAsyncThunk(
  "promotions/addOrUpdate",
  async (formData, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;

    try {
      const isUpdate = !!formData?.id;
      const url = isUpdate
        ? `${HTTPURL}promotion/${formData.id}` // PUT
        : `${HTTPURL}promotion`; // POST

      const method = isUpdate ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return (
        error?.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
  }
);

// ✅ Delete Promotion
export const deletePromotion = createAsyncThunk(
  "promotions/delete",
  async (promotionId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;

    try {
      const response = await axios.delete(
        `${HTTPURL}promotion/${promotionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return (
        error?.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
  }
);

// ✅ Fetch All Promotions
export const fetchPromotions = createAsyncThunk(
  "promotions/fetchAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;

    try {
      const response = await axios.get(`${HTTPURL}promotion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return (
        error?.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
  }
);

// ✅ Fetch Single Promotion by ID
export const fetchPromotionById = createAsyncThunk(
  "promotions/fetchById",
  async (promotionId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.token;

    try {
      const response = await axios.get(`${HTTPURL}promotion/${promotionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return (
        error?.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
  }
);
