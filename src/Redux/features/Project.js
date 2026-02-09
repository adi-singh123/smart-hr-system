import { createSlice } from "@reduxjs/toolkit";
import { fetchProjects } from "../services/Project";

const initialState = {
  isLoading: false,
  error: null,
  errorMsg: "",
  allProjects: [],
  selectedProject: "",
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Action to set the selected project
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ======== Fetch All Projects ======== //
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });

    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.allProjects = action.payload;
    });

    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
      state.errorMsg = action.payload;
    });
  },
});
export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
