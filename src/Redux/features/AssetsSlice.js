import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAssets,
  fetchAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../services/Assets";

const assetSlice = createSlice({
  name: "assets",
  initialState: {
    assets: [],         // all records
    selectedAsset: null, // single record
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch All
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is expected to be { success, message, data }
        state.assets = action.payload?.data || [];
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch by ID
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.selectedAsset = action.payload.data || null;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔁 Create
      .addCase(createAsset.fulfilled, (state, action) => {
        state.message = action.payload.message;
        if (action.payload.data) {
          state.assets.push(action.payload.data);
        }
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔄 Update
      .addCase(updateAsset.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          state.assets = state.assets.map((a) =>
            a.id === updated.id ? updated : a
          );
        }
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const deletedId = action.payload.deletedId;
        state.assets = state.assets.filter((a) => a.id !== deletedId);
      })
      .addCase(deleteAsset.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default assetSlice.reducer;
