/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  addImages,
  deleteImage,
  updateImage,
  getImages,
} from "../services/Image";

const initialState = {
  isLoading: false,
  editImage: {},
  token: localStorage.getItem("token"),
  error: "",
  errorMsg: "",
  images: [],
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    editImageFunction: (state, action) => {
      state.editImage = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addImages.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(addImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to add image";
      })
      .addCase(getImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.images = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch images";
      })
      .addCase(updateImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateImage.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to edit image";
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to delete image";
      });
  },
});

export default imageSlice.reducer;
export const { editImageFunction } = imageSlice.actions;
