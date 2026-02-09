import { createSlice } from "@reduxjs/toolkit";
import { Add_historian, get_historian_data, edit_historian_data, get_historian_contact } from '../services/Historian'
const initialState = {
    // token: JSON.parse(localStorage.getItem("token")) || null,
    isLoading: false,
    error: null,
    token: localStorage.getItem('token'),
    errorMsg: '',
    historianData: [],
    contactsData:[],
    EditHistorianList: []
};
export const historianSlice = createSlice({
    name: "historian",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // ========== Add_historian ============== //
        builder.addCase(Add_historian.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(Add_historian.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.errorMsg = action?.payload;
            state.logUserID = action?.payload?.data?.data?.id
        });
        builder.addCase(Add_historian.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
            state.errorMsg = action?.payload;
        });
        // ===========get historian data ============== //
        builder.addCase(get_historian_data.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(get_historian_data.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.historianData = action?.payload?.data
        });
        builder.addCase(get_historian_data.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        });
        // ==========get edit historian data ============== //
        builder.addCase(edit_historian_data.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(edit_historian_data.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.EditHistorianList = action?.payload?.data
        });
        builder.addCase(edit_historian_data.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        });
        // ===========get historian data ============== //
        builder.addCase(get_historian_contact.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(get_historian_contact.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.contactsData = action?.payload?.data
        });
        builder.addCase(get_historian_contact.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
        });
    }

});
export default historianSlice.reducer;
