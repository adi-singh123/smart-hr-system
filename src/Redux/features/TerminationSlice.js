/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_terminations,
  add_update_termination,
  edit_termination,
  delete_termination,
} from "../services/Termination";

const terminationSlice = createSlice({
  name: "termination",
  initialState: {
    terminations: [],
    loading: false,
    error: null,
    message: null,
    current: null, // holds a single termination for edit/preview
  },
  reducers: {
    clearMessage: (state) => { state.message = null; },
    clearError: (state) => { state.error = null; },
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- GET ALL ----------------
      .addCase(get_terminations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_terminations.fulfilled, (state, action) => {
        state.loading = false;
        state.terminations = action.payload?.data || [];
      })
      .addCase(get_terminations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch terminations";
      })

      // ---------------- ADD / UPDATE ----------------
      .addCase(add_update_termination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(add_update_termination.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Termination saved successfully";

        const newData = action.payload?.data;
        if (newData) {
          const existingIndex = state.terminations.findIndex((t) => t.id === newData.id);
          if (existingIndex !== -1) {
            state.terminations[existingIndex] = newData; // update existing
          } else {
            state.terminations.unshift(newData); // add new
          }
        }
      })
      .addCase(add_update_termination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save termination";
      })

      // ---------------- EDIT / GET SINGLE ----------------
      .addCase(edit_termination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(edit_termination.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload?.data || null;
      })
      .addCase(edit_termination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch termination";
      })

      // ---------------- DELETE ----------------
      .addCase(delete_termination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_termination.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.id;
        if (id) state.terminations = state.terminations.filter((t) => t.id !== id);
        state.message = action.payload?.message || "Termination deleted successfully";
      })
      .addCase(delete_termination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete termination";
      });
  },
});

export const { clearMessage, clearError, clearCurrent } = terminationSlice.actions;
export default terminationSlice.reducer;
