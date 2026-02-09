/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/Task";

const initialState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload || []; // ✅ FIXED
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch tasks";
      });

    // Create Task
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });

    // Update Task
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
    });

    // Delete Task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload); // ✅ FIXED
    });
  },
});

export const { selectTask } = taskSlice.actions;
export default taskSlice.reducer;
