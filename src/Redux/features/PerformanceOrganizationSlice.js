import { createSlice } from "@reduxjs/toolkit";


import {
  fetchPerformanceOrganizations,
  fetchPerformanceOrganizationById,
  createPerformanceOrganization,
  updatePerformanceOrganization,
  deletePerformanceOrganization,
} from "../services/PerformanceOrganization";

const performanceOrganizationSlice = createSlice({
  name: "performanceOrganizations",
  initialState: {
    organizations: [],
    selectedOrganization: null,
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch All
      .addCase(fetchPerformanceOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformanceOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.data;
      })
      .addCase(fetchPerformanceOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch by ID
      .addCase(fetchPerformanceOrganizationById.fulfilled, (state, action) => {
        state.selectedOrganization = action.payload.data;
      })
      .addCase(fetchPerformanceOrganizationById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔁 Create
      .addCase(createPerformanceOrganization.fulfilled, (state, action) => {
        state.message = action.payload.message;
        if (action.payload.data) {
          state.organizations.push(action.payload.data);
        }
      })
      .addCase(createPerformanceOrganization.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔄 Update
      .addCase(updatePerformanceOrganization.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          state.organizations = state.organizations.map((org) =>
            org.id === updated.id ? updated : org
          );
        }
      })
      .addCase(updatePerformanceOrganization.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deletePerformanceOrganization.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const deletedId = action.meta.arg;
        state.organizations = state.organizations.filter(
          (org) => org.id !== deletedId
        );
      })
      .addCase(deletePerformanceOrganization.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ---------------------- 🔹 Export Reducers ----------------------
export default performanceOrganizationSlice.reducer;
