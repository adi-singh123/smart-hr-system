/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  addOrUpdateLeave,
  deleteLeave,
  deleteLeaveAdmin,
  getAllLeaves,
  getLeaves,
  updateLeave as updateLeaveAdmin,
  getLeaveById,
  updateLeaveStatus, // 👈 added
} from "../services/EmployeeLeaves";

const initialState = {
  isLoading: false,
  error: false,
  errorMsg: "",
  Leaves: [],
  editLeave: {},
  allLeaves: [],
  leaveById: null,
};

const employeeLeavesSlice = createSlice({
  name: "EmployeeLeaves",
  initialState,
  reducers: {
    updateLeave: (state, action) => {
      state.editLeave = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ➤ Add or Update Leave
      .addCase(addOrUpdateLeave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addOrUpdateLeave.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(addOrUpdateLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to add or update leave";
      })

      // ➤ Delete Leave (Employee)
      .addCase(deleteLeave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLeave.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to delete leave";
      })

      // ➤ Get Leaves (Employee)
      .addCase(getLeaves.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.Leaves = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getLeaves.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch leaves";
      })

      // ➤ Get All Leaves (Admin)
      .addCase(getAllLeaves.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.allLeaves = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getAllLeaves.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch all leaves";
      })

      // ➤ Delete Leave (Admin)
      .addCase(deleteLeaveAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLeaveAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(deleteLeaveAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to delete leave";
      })

      // ➤ Update Leave (Admin)
      .addCase(updateLeaveAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLeaveAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(updateLeaveAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to update leave";
      })

      // ➤ Get Leave By ID
      .addCase(getLeaveById.pending, (state) => {
        state.isLoading = true;
        state.leaveById = null;
      })
      .addCase(getLeaveById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveById = action.payload || null;
        state.error = false;
      })
      .addCase(getLeaveById.rejected, (state, action) => {
        state.isLoading = false;
        state.leaveById = null;
        state.error = true;
        state.errorMsg =
          action.payload ||
          action.error?.message ||
          "Failed to fetch leave by ID";
      })

      // ➤ ✅ Update Leave Status (Admin / Employee)
      .addCase(updateLeaveStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;

        // Optional: Update status in existing array
        const updated = action.payload?.data;
        if (updated) {
          state.allLeaves = state.allLeaves.map((leave) =>
            leave.id === updated.id
              ? { ...leave, status: updated.status }
              : leave
          );
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.payload ||
          action.error?.message ||
          "Failed to update leave status";
      });
  },
});

export default employeeLeavesSlice.reducer;
export const { updateLeave } = employeeLeavesSlice.actions;
