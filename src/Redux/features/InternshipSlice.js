/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchInternshipApplications,
  deleteInternshipApplication,
} from "../services/InternshipForm";

const initialState = {
  internshipApplications: [],
  loading: false,
  error: null,
  message: null,
};

const internshipSlice = createSlice({
  name: "internship",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Internship Applications
      .addCase(fetchInternshipApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternshipApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.internshipApplications = action.payload; // array
      })
      .addCase(fetchInternshipApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch internship applications";
      })

      // ✅ Delete Internship Application
      .addCase(deleteInternshipApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInternshipApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Deleted successfully";

        state.internshipApplications = state.internshipApplications.filter(
          (item) => item.id !== action.meta.arg
        );
      })
      .addCase(deleteInternshipApplication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to delete internship application";
      });
  },
});

export default internshipSlice.reducer;
