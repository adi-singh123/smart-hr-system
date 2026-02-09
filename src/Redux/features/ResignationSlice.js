/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_resignations,
  add_update_resignation,
  edit_resignation,
  delete_resignation,
} from "../services/Resignation";

const resignationSlice = createSlice({
  name: "resignation",
  initialState: {
    resignations: [],
    loading: false,
    error: null,
    message: null,
    current: null, // For preview/edit
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- GET ALL ----------------
      .addCase(get_resignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_resignations.fulfilled, (state, action) => {
        state.loading = false;
        state.resignations = action.payload?.data || [];
      })
      .addCase(get_resignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch resignations";
      })

      // ---------------- ADD / UPDATE ----------------
      .addCase(add_update_resignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(add_update_resignation.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Resignation saved successfully";

        const newData = action.payload?.data;
        if (newData) {
          const existingIndex = state.resignations.findIndex(
            (r) => r.id === newData.id
          );
          if (existingIndex !== -1) {
            state.resignations[existingIndex] = newData; // update existing
          } else {
            state.resignations.unshift(newData); // add new
          }
        }
      })
      .addCase(add_update_resignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save resignation";
      })

      // ---------------- EDIT / GET SINGLE ----------------
      .addCase(edit_resignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(edit_resignation.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload?.data || null;
      })
      .addCase(edit_resignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch resignation";
      })

      // ---------------- DELETE ----------------
      .addCase(delete_resignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_resignation.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.id;
        if (id) {
          state.resignations = state.resignations.filter((r) => r.id !== id);
        }
        state.message =
          action.payload?.message || "Resignation deleted successfully";
      })
      .addCase(delete_resignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete resignation";
      });
  },
});

export const { clearMessage, clearError, clearCurrent } =
  resignationSlice.actions;
export default resignationSlice.reducer;
