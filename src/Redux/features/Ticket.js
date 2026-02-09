import { createSlice } from "@reduxjs/toolkit";
import { get_tickets } from "../services/Ticket";

const initialState = {
    isLoading: false,
    error: null,
    errorMsg: '',
    allTickets: [], 
};

export const ticketSlice = createSlice({
    name: "tickets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ========== Fetch All Tickets ========== //
        builder.addCase(get_tickets.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(get_tickets.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.allTickets = action?.payload; 
        });
        builder.addCase(get_tickets.rejected, (state, action) => {
            state.isLoading = false;
            state.error = true;
            state.errorMsg = action?.payload;
        });
    },
});

export default ticketSlice.reducer;
