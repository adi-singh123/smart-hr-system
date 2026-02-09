import { createSlice } from "@reduxjs/toolkit";
import { fetchFiles, uploadFile, updateFile, deleteFile } from "../services/File";

const fileSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFileMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch files";
      })

      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) state.files.push(action.payload.data);
        state.message = action.payload?.message || "File uploaded successfully";
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to upload file";
      })

      // Update File
      .addCase(updateFile.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const index = state.files.findIndex(f => f.id === action.payload.data.id);
          if (index !== -1) state.files[index] = action.payload.data;
        }
        state.message = action.payload?.message || "File updated successfully";
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update file";
      })

      // Delete File
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f.id !== action.meta.arg);
        state.message = action.payload?.message || "File deleted successfully";
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete file";
      });
  },
});

export const { clearFileMessage } = fileSlice.actions;
export default fileSlice.reducer;
