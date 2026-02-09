/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_all_timesheets,
  add_timesheet,
  update_timesheet,
  delete_timesheet,
} from "../services/Timesheet";

const initialState = {
  isLoading: false,
  error: null,
  errorMsg: "",
  AllTimesheets: [],
  EditTimesheetData: {},
  timesheetEditId: null,
};

export const TimesheetSlice = createSlice({
  name: "timesheet",
  initialState,
  reducers: {
    setTimesheetEditID: (state, action) => {
      state.timesheetEditId = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ============================================
    // 🟢 Add Timesheet
    // ============================================
    builder
      .addCase(add_timesheet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(add_timesheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.errorMsg = action?.payload?.message || "Timesheet added";
      })
      .addCase(add_timesheet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });

    // ============================================
    // 🟢 Get All Timesheets
    // ============================================
    builder
      .addCase(get_all_timesheets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_timesheets.fulfilled, (state, action) => {
        state.isLoading = false;

        state.AllTimesheets = action.payload.data; // THIS IS CORRECT
      })
      .addCase(get_all_timesheets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // 🟢 Update Timesheet
    // ============================================
    builder
      .addCase(update_timesheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update_timesheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.errorMsg = action?.payload?.message || "Timesheet updated";

        // Update local list
        if (state.AllTimesheets && Array.isArray(state.AllTimesheets)) {
          state.AllTimesheets = state.AllTimesheets.map((item) =>
            item.id === state.timesheetEditId ? action.payload?.data : item
          );
        }
      })
      .addCase(update_timesheet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // 🟢 Delete Timesheet
    // ============================================
    builder
      .addCase(delete_timesheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delete_timesheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.errorMsg = action?.payload?.message || "Timesheet deleted";

        // Safe remove from state
        if (Array.isArray(state.AllTimesheets)) {
          state.AllTimesheets = state.AllTimesheets.filter(
            (item) => item.id !== action.meta.arg
          );
        }
      })
      .addCase(delete_timesheet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });
  },
});

export const { setTimesheetEditID } = TimesheetSlice.actions;
export default TimesheetSlice.reducer;
