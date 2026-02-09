/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  submitPersonalInfo,
  fetchPersonalInfo,
  submit_emergency_contact,
  fetchEmergencyContact,
  submit_bank_details,
  fetchBankDetails,
  submit_family_information,
  fetchFamilyInfo,
  update_family_information,
  submit_education_information,
  fetchEducationInfo,
  submit_exp_details,
  fetchExperienceInfo,
  submitProfileInfo,
  fetchProfileInfo,
  add_asset,
  fetchAsset,
  deleteAsset,
  addBank,
  fetchBank,
} from "../services/Profile"; // 👈 adjust import path if needed

const initialState = {
  loading: false,
  error: null,

  personalInfo: null,
  emergencyContact: null,
  bankDetails: null,
  familyInfo: null,
  educationInfo: null,
  experienceInfo: null,
  profileInfo: null,
  assets: [],
  bankList: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfileData: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // ---------------- PERSONAL INFO ----------------
      .addCase(submitPersonalInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.personalInfo = action.payload?.data || null;
      })
      .addCase(submitPersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
        state.personalInfo = action.payload?.data || null;
      })

      // ---------------- EMERGENCY CONTACT ----------------
      .addCase(submit_emergency_contact.pending, (state) => {
        state.loading = true;
      })
      .addCase(submit_emergency_contact.fulfilled, (state, action) => {
        state.loading = false;
        state.emergencyContact = action.payload?.data || null;
      })
      .addCase(submit_emergency_contact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmergencyContact.fulfilled, (state, action) => {
        state.emergencyContact = action.payload?.data || null;
      })

      // ---------------- BANK DETAILS ----------------
      .addCase(submit_bank_details.pending, (state) => {
        state.loading = true;
      })
      .addCase(submit_bank_details.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload?.data || null;
      })
      .addCase(submit_bank_details.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.bankDetails = action.payload?.data || null;
      })

      // ---------------- FAMILY INFO ----------------
      .addCase(submit_family_information.pending, (state) => {
        state.loading = true;
      })
      .addCase(submit_family_information.fulfilled, (state, action) => {
        state.loading = false;
        state.familyInfo = action.payload?.data || null;
      })
      .addCase(update_family_information.fulfilled, (state, action) => {
        state.familyInfo = action.payload?.data || null;
      })
      .addCase(fetchFamilyInfo.fulfilled, (state, action) => {
        state.familyInfo = action.payload?.data || null;
      })

      // ---------------- EDUCATION INFO ----------------
      .addCase(submit_education_information.fulfilled, (state, action) => {
        state.educationInfo = action.payload?.data || null;
      })
      .addCase(fetchEducationInfo.fulfilled, (state, action) => {
        state.educationInfo = action.payload?.data || null;
      })

      // ---------------- EXPERIENCE INFO ----------------
      .addCase(submit_exp_details.fulfilled, (state, action) => {
        state.experienceInfo = action.payload?.data || null;
      })
      .addCase(fetchExperienceInfo.fulfilled, (state, action) => {
        state.experienceInfo = action.payload?.data || null;
      })

      // ---------------- PROFILE INFO ----------------
      .addCase(submitProfileInfo.fulfilled, (state, action) => {
        state.profileInfo = action.payload?.data || null;
      })
      .addCase(fetchProfileInfo.fulfilled, (state, action) => {
        state.profileInfo = action.payload?.data || null;
      })

      // ---------------- ASSETS ----------------
      .addCase(add_asset.fulfilled, (state, action) => {
        if (action.payload?.status) {
          state.assets.push(action.payload.data);
        }
      })
      .addCase(fetchAsset.fulfilled, (state, action) => {
        state.assets = action.payload?.data || [];
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.assets = state.assets.filter((a) => a.id !== deletedId);
      })

      // ---------------- BANK (list) ----------------
      .addCase(addBank.fulfilled, (state, action) => {
        if (action.payload?.status) {
          state.bankList.push(action.payload.data);
        }
      })
      .addCase(fetchBank.fulfilled, (state, action) => {
        state.bankList = action.payload?.data || [];
      });
  },
});

export const { clearProfileError, resetProfileData } = profileSlice.actions;
export default profileSlice.reducer;
