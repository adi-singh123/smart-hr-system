/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { fetchJobApplications, deleteJobApplication } from "../services/JobForm";

const initialState = {
  jobApplications: [],
  loading: false,
  error: null,
  message: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch job applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload; // ← array from thunk
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch job applications";
      })

      // ✅ Delete job application
      .addCase(deleteJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Deleted successfully";
        // Remove deleted item from state
        state.jobApplications = state.jobApplications.filter(
          (job) => job.id !== action.meta.arg
        );
      })
      .addCase(deleteJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete job application";
      });
  },
});

export default jobSlice.reducer;
