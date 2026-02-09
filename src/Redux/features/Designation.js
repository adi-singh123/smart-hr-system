/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_all_active_designation,
  Add_designation,
  edit_designation_data,
  get_designation_data,
  delete_designation, // ✅ correct import
} from "../services/Designation";

const initialState = {
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),
  errorMsg: "",
  ActiveDesignation: [],
  EditDesignationData: [],
  designationEditId: null,
  AllDesignation: [],
};

export const DesignationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {
    setDesignationEditID: (state, action) => {
      state.designationEditId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ✅ Add Designation
    builder
      .addCase(Add_designation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Add_designation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.errorMsg = action?.payload?.message || "Added successfully";
      })
      .addCase(Add_designation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });

    // ✅ Get Active Designation
    builder
      .addCase(get_all_active_designation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_active_designation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ActiveDesignation = action.payload?.data || [];
      })
      .addCase(get_all_active_designation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ Get Edit Designation
    builder
      .addCase(edit_designation_data.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edit_designation_data.fulfilled, (state, action) => {
        state.isLoading = false;
        state.EditDesignationData = action.payload?.data || {};
      })
      .addCase(edit_designation_data.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ Get All Designation
    builder
      .addCase(get_designation_data.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_designation_data.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllDesignation = action.payload?.data || [];
      })
      .addCase(get_designation_data.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ✅ Delete Designation
    builder
      .addCase(delete_designation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delete_designation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.errorMsg = action?.payload?.message || "Deleted successfully";

        // ✅ Safe filter: only if data array exists
        if (
          state.AllDesignation?.data &&
          Array.isArray(state.AllDesignation.data)
        ) {
          state.AllDesignation.data = state.AllDesignation.data.filter(
            (item) => item.id !== action.meta.arg
          );
        }
      })
      .addCase(delete_designation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });
  },
});

export const { setDesignationEditID } = DesignationSlice.actions;
export default DesignationSlice.reducer;
