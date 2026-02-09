/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  VerifyOtp,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getFullUserById, // ✅ import new thunk
  getName,
} from "../services/User";

const initialState = {
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),
  logUserID: "",
  errorMsg: "",
  value: { email: "", password: "", header: false },
  users: [],
  fullUserData: null, // ✅ added for getFullUserById
  fetchedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.value = { email: "", password: "" };
      state.fullUserData = null; // clear profile on logout
    },
    setLayout: (state, { payload }) => {
      state.layout = payload;
    },
    setToogleHeader: (state, { payload }) => {
      state.header = payload;
    },
  },
  extraReducers: (builder) => {
    // ========== Login ============== //
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.logUserID = action?.payload?.data?.id;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    // ========== Verify Otp ============== //
    builder.addCase(VerifyOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(VerifyOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action?.payload?.data?.token;
      localStorage.setItem("role", action.payload?.data?.role?.name);
    });
    builder.addCase(VerifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "OTP verification failed";
    });

    // ========== Forgot Password ============== //
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.token = action?.payload?.data?.token;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });

    // ========== Reset Password ============== //
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.token = action?.payload?.data?.token;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });

    // ========== Get All Users ============== //
    builder.addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action?.payload?.data?.users || [];
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload || "Failed to fetch users";
    });

    // ========== Get Full User By Id ============== //
    builder.addCase(getFullUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFullUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.fullUserData = action.payload; // ✅ store full user object
    });
    builder.addCase(getFullUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch full user details";
    });

    // ========== Get Name ============== //
    builder.addCase(getName.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getName.fulfilled, (state, action) => {
      state.isLoading = false;
      state.fetchedUser = action.payload; // ✅ poora object store karega (id, fullName, employee_id)
    });
    builder.addCase(getName.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch user name";
    });
  },
});

export const { setLayout, setToogleHeader } = userSlice.actions;
export default userSlice.reducer;
