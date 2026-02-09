import { createSlice, createAction } from "@reduxjs/toolkit";
import { Add_event, edit_event, get_all_events, delete_event } from "../services/Calendar";

const initialState = {
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  errorMsg: "",
};

// Action to select an event for editing
export const setSelectedEvent = createAction("calendar/setSelectedEvent");

const calendarSlice = createSlice({
  name: "Calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Set Selected Event
    builder.addCase(setSelectedEvent, (state, action) => {
      state.selectedEvent = action.payload;
    });

    // ================= Add Event =================
    builder.addCase(Add_event.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(Add_event.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // Optionally add to local events array
      // state.events.push(action.payload.data);
    });
    builder.addCase(Add_event.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.errorMsg = action.payload;
    });

    // ================= Get All Events =================
    builder.addCase(get_all_events.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(get_all_events.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.events = action.payload.data;
    });
    builder.addCase(get_all_events.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.errorMsg = action.payload;
    });

    // ================= Edit Event =================
    builder.addCase(edit_event.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(edit_event.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // Update the local events array
      const index = state.events.findIndex(
        (ev) => ev.id === action.payload.data.id
      );
      if (index !== -1) state.events[index] = action.payload.data;
    });
    builder.addCase(edit_event.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.errorMsg = action.payload;
    });

    // ================= Delete Event =================
    builder.addCase(delete_event.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(delete_event.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.events = state.events.filter(
        (ev) => ev.id !== action.payload.data.id
      );
    });
    builder.addCase(delete_event.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.errorMsg = action.payload;
    });
  },
});

export default calendarSlice.reducer;