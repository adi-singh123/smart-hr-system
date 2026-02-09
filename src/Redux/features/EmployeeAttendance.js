/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPunchData,
  getPunchData,
  punch,
  getPunchType,
  getBreakHours,
  getWorkingHours,
} from "../services/EmployeeAttendance";

const initialState = {
  isLoading: false,
  error: false,
  errorMsg: "",
  todayPunchData: [],
  punchData: [],
  latestPunchType: "",
  Breakhours: {},
  workingHours: [], // ✅ new
  workingHoursLoading: false,
};

const employeeAttendanceSlice = createSlice({
  name: "EmployeeAttendance",
  initialState,
  extraReducers: (builder) => {
    builder
      // ✅ PUNCH
      .addCase(punch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(punch.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(punch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to punch";
      })

      // ✅ GET TODAY'S PUNCH DATA
      .addCase(getPunchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPunchData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.todayPunchData = action.payload.data;
          state.error = false;
        } else {
          // 👇 agar status false ya "no user found" type ka message aaya to old data clear
          state.todayPunchData = [];
          state.error = true;
          state.errorMsg = action?.payload?.message || "No user found";
        }
      })
      .addCase(getPunchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to fetch today's punch data";
        state.todayPunchData = [];
      })

      // ✅ GET ALL PUNCH DATA
      .addCase(getAllPunchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPunchData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.punchData = action.payload.data;
          state.error = false;
        } else {
          // 👇 agar backend se "no user found" aaya ho to old punchData clear
          state.punchData = [];
          state.error = true;
          state.errorMsg = action?.payload?.message || "No user found";
        }
      })
      .addCase(getAllPunchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch punch data";
        state.punchData = [];
      })

      // ✅ GET PUNCH TYPE
      .addCase(getPunchType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPunchType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.latestPunchType = action.payload.data;
          state.error = false;
        } else {
          state.latestPunchType = "";
          state.error = true;
          state.errorMsg = action?.payload?.message || "No user found";
        }
      })
      .addCase(getPunchType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch punch type";
        state.latestPunchType = "";
      })

      // ✅ GET BREAK HOURS
      .addCase(getBreakHours.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBreakHours.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.Breakhours = action.payload.data;
          state.error = false;
        } else {
          state.Breakhours = {};
          state.error = true;
          state.errorMsg = action?.payload?.message || "No user found";
        }
      })
      .addCase(getBreakHours.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch break hours";
      })
      .addCase(getWorkingHours.pending, (state) => {
        state.workingHoursLoading = true;
      })
      .addCase(getWorkingHours.fulfilled, (state, action) => {
        state.workingHoursLoading = false;
        if (action?.payload?.status) {
          state.workingHours = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getWorkingHours.rejected, (state, action) => {
        state.workingHoursLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to fetch working hours";
        state.errorMsg = action.error?.message || "Failed to fetch break hours";
        state.Breakhours = {};
      });
  },
});

export default employeeAttendanceSlice.reducer;
