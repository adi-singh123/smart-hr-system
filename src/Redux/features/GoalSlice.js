/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGoals as getGoalsService,
  addGoal as addGoalService,
  updateGoal as updateGoalService,
  deleteGoal as deleteGoalService,
} from "../services/GoalService";

// ------------------ Async Thunks ------------------

// Fetch all goals
export const getGoals = createAsyncThunk(
  "goal/getGoals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getGoalsService();
      return res.data.data || res.data; // handle API response structure
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add new goal
export const addGoal = createAsyncThunk(
  "goal/addGoal",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addGoalService(payload);
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update goal
export const updateGoal = createAsyncThunk(
  "goal/updateGoal",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await updateGoalService(id, payload);
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete goal
export const deleteGoal = createAsyncThunk(
  "goal/deleteGoal",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteGoalService(id);
      return { id, message: res.data.message || "Deleted" };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------ Slice ------------------
const GoalSlice = createSlice({
  name: "goal",
  initialState: {
    goals: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearGoalState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Goals
      .addCase(getGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Goal
      .addCase(addGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload);
        state.success = "Goal added successfully";
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.goals[index] = action.payload;
        state.success = "Goal updated successfully";
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = state.goals.filter((g) => g.id !== action.payload.id);
        state.success = action.payload.message || "Goal deleted successfully";
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGoalState } = GoalSlice.actions;
export default GoalSlice.reducer;
