/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPromotions,
  addOrUpdatePromotion,
  deletePromotion,
  fetchPromotionById,
} from "../services/Promotion";

const promotionsSlice = createSlice({
  name: "promotions",
  initialState: {
    promotions: [], // 🔹 All promotions list
    selectedPromotion: null, // 🔹 Single promotion details
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch all promotions
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload?.data || [];
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add or update promotion
      .addCase(addOrUpdatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrUpdatePromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(addOrUpdatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Delete promotion
      .addCase(deletePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Fetch promotion by ID
      .addCase(fetchPromotionById.pending, (state) => {
        state.loading = true;
        state.selectedPromotion = null;
      })
      .addCase(fetchPromotionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPromotion = action.payload?.data || null;
      })
      .addCase(fetchPromotionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default promotionsSlice.reducer;
