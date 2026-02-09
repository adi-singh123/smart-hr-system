/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_all_shift_rosters,
  add_shift_roster,
  update_shift_roster,
  delete_shift_roster,
} from "../services/ShiftRoster";

const initialState = {
  isLoading: false,
  error: null,
  errorMsg: "",
  AllShiftRosters: [],
  editRosterId: null,
};

export const ShiftRosterSlice = createSlice({
  name: "shiftRoster",
  initialState,
  reducers: {
    setShiftRosterEditID: (state, action) => {
      state.editRosterId = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // 🟢 Add Shift Roster
    // ======================================
    builder
      .addCase(add_shift_roster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(add_shift_roster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.payload?.message;
      })
      .addCase(add_shift_roster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });

    // ======================================
    // 🟢 Get All Shift Rosters
    // ======================================
    builder
      .addCase(get_all_shift_rosters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_shift_rosters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllShiftRosters = action.payload.data;
      })
      .addCase(get_all_shift_rosters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ======================================
    // 🟢 Update Shift Roster
    // ======================================
    builder
      .addCase(update_shift_roster.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update_shift_roster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action.payload?.message;

        // Update modified roster
        state.AllShiftRosters = state.AllShiftRosters?.map((item) =>
          item.id === state.editRosterId ? action.payload.data : item
        );
      })
      .addCase(update_shift_roster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ======================================
    // 🟢 Delete Shift Roster
    // ======================================
    builder
      .addCase(delete_shift_roster.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delete_shift_roster.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action?.payload?.message;

        state.AllShiftRosters = state.AllShiftRosters.filter(
          (item) => item.id !== action.meta.arg
        );
      })
      .addCase(delete_shift_roster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.payload;
      });
  },
});

export const { setShiftRosterEditID } = ShiftRosterSlice.actions;
export default ShiftRosterSlice.reducer;
