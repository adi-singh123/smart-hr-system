/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEmployeeOfMonths,
  addEmployeeOfMonth,
  updateEmployeeOfMonth,
  deleteEmployeeOfMonth,
  fetchEmployeeOfMonthById,
} from "../services/EmployeeOfMonth";

const employeeOfMonthSlice = createSlice({
  name: "employeeOfMonth",
  initialState: {
    employeeOfMonthList: [],
    selectedRecord: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearEmployeeOfMonthMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch all Employee of the Month records
      .addCase(fetchEmployeeOfMonths.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeOfMonths.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeOfMonthList = action.payload?.data || [];
      })
      .addCase(fetchEmployeeOfMonths.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add Employee of the Month
      .addCase(addEmployeeOfMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEmployeeOfMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Employee added successfully";
        // Optional: push directly in list if you want live UI update
        if (action.payload?.data) {
          state.employeeOfMonthList.unshift(action.payload.data);
        }
      })
      .addCase(addEmployeeOfMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update Employee of the Month
      .addCase(updateEmployeeOfMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeOfMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Employee updated successfully";
        // Optional: update in local list
        const updated = action.payload?.data;
        if (updated) {
          const index = state.employeeOfMonthList.findIndex(
            (r) => r.id === updated.id
          );
          if (index !== -1) state.employeeOfMonthList[index] = updated;
        }
      })
      .addCase(updateEmployeeOfMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Delete Employee of the Month
      .addCase(deleteEmployeeOfMonth.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeOfMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Deleted successfully";
        const deleted = action.payload?.data;
        if (deleted?.id) {
          state.employeeOfMonthList = state.employeeOfMonthList.filter(
            (r) => r.id !== deleted.id
          );
        }
      })
      .addCase(deleteEmployeeOfMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Fetch Employee of the Month by ID
      .addCase(fetchEmployeeOfMonthById.pending, (state) => {
        state.loading = true;
        state.selectedRecord = null;
      })
      .addCase(fetchEmployeeOfMonthById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload?.data || null;
      })
      .addCase(fetchEmployeeOfMonthById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeOfMonthMessage } = employeeOfMonthSlice.actions;
export default employeeOfMonthSlice.reducer;
