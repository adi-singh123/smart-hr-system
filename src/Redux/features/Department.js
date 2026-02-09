/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  get_all_active_departments,
  Add_department,
  get_department_data,
  deleteDepartment,
  edit_department_data,
  getDepartmentById, // 👈 new service import
} from "../services/Department";

const initialState = {
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),
  errorMsg: "",
  ActiveDepartments: [],
  AllDepartments: [],
  EditDepartmentData: [],
  SelectedDepartment: null, // 👈 new state for getDepartmentById
  departmentEditId: null,
};

export const DepartmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartmentEditID: (state, action) => {
      state.departmentEditId = action.payload;
    },
    resetDepartmentError: (state) => {
      state.error = null;
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    // 🔹 Add Department
    builder.addCase(Add_department.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(Add_department.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(Add_department.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // 🔹 Get All Departments
    builder.addCase(get_department_data.fulfilled, (state, action) => {
      state.isLoading = false;
      state.AllDepartments = action?.payload?.data || [];
    });

    // 🔹 Get Active Departments
    builder.addCase(get_all_active_departments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ActiveDepartments = action?.payload?.data || [];
    });

    // 🔹 Delete Department
    builder.addCase(deleteDepartment.fulfilled, (state, action) => {
      state.isLoading = false;
      const deletedId = action.payload.id;

      if (Array.isArray(state.AllDepartments)) {
        state.AllDepartments = state.AllDepartments.filter(
          (dept) => dept.id !== deletedId
        );
      } else if (Array.isArray(state.AllDepartments?.departments)) {
        state.AllDepartments.departments =
          state.AllDepartments.departments.filter(
            (dept) => dept.id !== deletedId
          );
      }
    });

    // 🔹 Edit Department
    builder.addCase(edit_department_data.fulfilled, (state, action) => {
      state.isLoading = false;
      state.EditDepartmentData = action?.payload?.data || {};
    });

    // 🔹 Get Department By ID (NEW)
    builder.addCase(getDepartmentById.pending, (state) => {
      state.isLoading = true;
      state.SelectedDepartment = null;
    });
    builder.addCase(getDepartmentById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.SelectedDepartment = action?.payload || null;
    });
    builder.addCase(getDepartmentById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to fetch department details";
    });
  },
});

export const { setDepartmentEditID, resetDepartmentError } =
  DepartmentSlice.actions;

export default DepartmentSlice.reducer;
