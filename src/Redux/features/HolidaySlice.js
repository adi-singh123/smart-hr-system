/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_holidays,
  add_holiday,
  update_holiday,
  delete_holiday,
} from "../services/Holiday";

const HolidaySlice = createSlice({
  name: "holiday",
  initialState: {
    holidays: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Get holidays
      .addCase(get_holidays.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_holidays.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Ensure it's always an array
        state.holidays = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })
      .addCase(get_holidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add holiday
      .addCase(add_holiday.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.holidays.push(action.payload.data);
        }
      })

      // 🔹 Update holiday
      .addCase(update_holiday.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const index = state.holidays.findIndex(
            (h) => h.id === action.payload.data.id
          );
          if (index !== -1) {
            state.holidays[index] = action.payload.data;
          }
        }
      })

      // 🔹 Delete holiday
      .addCase(delete_holiday.fulfilled, (state, action) => {
        const deletedId = action.meta?.arg || action.payload?.id;
        if (deletedId) {
          state.holidays = state.holidays.filter((h) => h.id !== deletedId);
        }
      });
  },
});

export default HolidaySlice.reducer;
