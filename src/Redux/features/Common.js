import { createSlice } from "@reduxjs/toolkit";
import { getSubCategories, getRoles } from "../services/common";
const initialState = {
    // token: JSON.parse(localStorage.getItem("token")) || null,
    isLoading: false,
    error: null,
    token: localStorage.getItem('token'),
    subCategories: [],
    getRolesData: [],
    editUserId: {},
    errorMsg: '',
};
export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setEditUserId: (state, action) => {
            state.editUserId = action?.payload;
        },
    },
    extraReducers: (builder) => {
        // ========== getSubCategories ============== //
        builder.addCase(getSubCategories.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(getSubCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.subCategories = action?.payload?.data
        });
        builder.addCase(getSubCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
            state.errorMsg = action?.payload;
        });
        // ========== getRoles data ============== //
        builder.addCase(getRoles.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.getRolesData = action?.payload?.data
        });
        builder.addCase(getRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action?.payload;
            state.errorMsg = action?.payload;
        });
    }

});
export const { setEditUserId } = commonSlice?.actions;
export default commonSlice.reducer;
