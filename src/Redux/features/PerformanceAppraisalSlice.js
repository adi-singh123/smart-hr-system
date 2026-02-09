import { createSlice } from "@reduxjs/toolkit";
import {
  createPerformanceAppraisal,
  updatePerformanceAppraisal,
  fetchPerformanceAppraisals,
  fetchPerformanceAppraisalById,
  deletePerformanceAppraisal,
} from "../services/PerformanceAppraisal";

const performanceAppraisalSlice = createSlice({
  name: "performanceAppraisals",
  initialState: {
    appraisals: [],
    selectedAppraisal: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch All
      .addCase(fetchPerformanceAppraisals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformanceAppraisals.fulfilled, (state, action) => {
        state.loading = false;
        state.appraisals = action.payload?.data || []; // ensure data comes from backend response
      })
      .addCase(fetchPerformanceAppraisals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch appraisals";
      })

      // 📄 Fetch by ID
      .addCase(fetchPerformanceAppraisalById.fulfilled, (state, action) => {
        state.selectedAppraisal = action.payload?.data || null;
      })

      // 🔁 Create
      .addCase(createPerformanceAppraisal.fulfilled, (state, action) => {
        state.appraisals.push(action.payload?.data);
        state.message = "Appraisal created successfully!";
      })

      // 🔄 Update
      .addCase(updatePerformanceAppraisal.fulfilled, (state, action) => {
        state.appraisals = state.appraisals.map((item) =>
          item.id === action.payload?.data?.id ? action.payload?.data : item
        );
        state.message = "Appraisal updated successfully!";
      })

      // ❌ Delete
      .addCase(deletePerformanceAppraisal.fulfilled, (state, action) => {
        state.appraisals = state.appraisals.filter(
          (item) => item.id !== action.meta.arg
        );
        state.message = "Appraisal deleted successfully!";
      });
  },
});

export const { clearMessage } = performanceAppraisalSlice.actions;
export default performanceAppraisalSlice.reducer;
