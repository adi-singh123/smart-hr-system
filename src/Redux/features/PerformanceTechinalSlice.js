import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPerformanceTechnicals,
  fetchPerformanceTechnicalById,
  createPerformanceTechnical,
  updatePerformanceTechnical,
  deletePerformanceTechnical,
} from "../services/PerformanceTechnical.js";

const performanceTechnicalSlice = createSlice({
  name: "performanceTechnicals",
  initialState: {
    technicals: [],
    selectedTechnical: null,
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch All
      .addCase(fetchPerformanceTechnicals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformanceTechnicals.fulfilled, (state, action) => {
        state.loading = false;
        state.technicals = action.payload.data;
      })
      .addCase(fetchPerformanceTechnicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch by ID
      .addCase(fetchPerformanceTechnicalById.fulfilled, (state, action) => {
        state.selectedTechnical = action.payload.data;
      })
      .addCase(fetchPerformanceTechnicalById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔁 Create
      .addCase(createPerformanceTechnical.fulfilled, (state, action) => {
        state.message = action.payload.message;
        if (action.payload.data) {
          state.technicals.push(action.payload.data);
        }
      })
      .addCase(createPerformanceTechnical.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔄 Update
      .addCase(updatePerformanceTechnical.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          state.technicals = state.technicals.map((tech) =>
            tech.id === updated.id ? updated : tech
          );
        }
      })
      .addCase(updatePerformanceTechnical.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deletePerformanceTechnical.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const deletedId = action.meta.arg;
        state.technicals = state.technicals.filter(
          (tech) => tech.id !== deletedId
        );
      })
      .addCase(deletePerformanceTechnical.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default performanceTechnicalSlice.reducer;
