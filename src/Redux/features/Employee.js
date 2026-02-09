import { createSlice, createAction } from "@reduxjs/toolkit";
import {
  Add_employee,
  edit_employee_data,
  get_employee_data,
  get_my_profile,
} from "../services/Employee";
import {
  fetchPersonalInfo,
  fetchProfileInfo,
  fetchEducationInfo,
  fetchEmergencyContact,
  fetchExperienceInfo,
  fetchFamilyInfo,
  fetchBankDetails,
  fetchAsset,
  fetchBank,
} from "../services/Profile";

const initialState = {
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),
  errorMsg: "",
  profileData: {},
  employeeData: [],
  selectedEducation: null,
  selectedExperience: null,
  EditEmployeeList: [],
  personalInformation: {},
  emergencyContact: {},
  bankdetails: {},
  familyInformation: [],
  experienceInformation: [],
  educationInformation: [],
  addressInformation: {},
  assetdata: [],
  bankandstatutory: {},
};
export const setSelectedEducation = createAction(
  "employee/setSelectedEducation"
);
export const setSelectedExperience = createAction(
  "employee/setSelectedExperience"
);
export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsset.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchAsset.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.assetdata = action?.payload?.data; // Update assetdata with fetched data
    });
    builder.addCase(fetchAsset.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });

    builder.addCase(setSelectedEducation, (state, action) => {
      state.selectedEducation = action.payload;
    });

    builder.addCase(setSelectedExperience, (state, action) => {
      state.selectedExperience = action.payload;
    });

    // ========== Add_employee ============== //
    builder.addCase(Add_employee.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(Add_employee.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.logUserID = action?.payload?.data?.data?.id;
    });
    builder.addCase(Add_employee.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });
    // ===========get employee data ============== //
    builder.addCase(get_employee_data.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(get_employee_data.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.employeeData = action?.payload?.data;
    });
    builder.addCase(get_employee_data.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });
    // ==========get edit historian data ============== //
    builder.addCase(edit_employee_data.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(edit_employee_data.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.EditEmployeeList = action?.payload?.data;
    });
    builder.addCase(edit_employee_data.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });

    // ==========get my profile data ============== //
    builder.addCase(get_my_profile.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(get_my_profile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.profileData = action?.payload?.data;
    });
    builder.addCase(get_my_profile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });
    builder.addCase(fetchPersonalInfo.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchPersonalInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.personalInformation = action?.payload?.data;
    });
    builder.addCase(fetchPersonalInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchEmergencyContact.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchEmergencyContact.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.emergencyContact = action?.payload?.data;
    });
    builder.addCase(fetchEmergencyContact.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchBankDetails.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchBankDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.bankdetails = action?.payload?.data;
    });
    builder.addCase(fetchBankDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchFamilyInfo.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchFamilyInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.familyInformation = action?.payload?.data;
    });
    builder.addCase(fetchFamilyInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchExperienceInfo.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchExperienceInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.experienceInformation = action?.payload?.data;
    });
    builder.addCase(fetchExperienceInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchEducationInfo.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchEducationInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.educationInformation = action?.payload?.data;
    });
    builder.addCase(fetchEducationInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });

    builder.addCase(fetchProfileInfo.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchProfileInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.errorMsg = action?.payload;
      state.addressInformation = action?.payload?.data;
    });
    builder.addCase(fetchProfileInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
      state.errorMsg = action?.payload;
    });
    builder.addCase(fetchBank.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchBank.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.bankandstatutory = action?.payload;
    });
    builder.addCase(fetchBank.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload;
    });
  },
});
export default employeeSlice.reducer;
