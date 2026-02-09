/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as GoalTypeService from "../services/GoalTypeService";

// ✅ Fetch all goal types
export const fetchGoalTypes = createAsyncThunk(
  "goalType/fetchGoalTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GoalTypeService.getGoalTypes();
      return res.data.data; // assuming API response has { data: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Add new goal type
export const addGoalType = createAsyncThunk(
  "goalType/addGoalType",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await GoalTypeService.addGoalType(payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update goal type
export const updateGoalType = createAsyncThunk(
  "goalType/updateGoalType",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await GoalTypeService.updateGoalType(id, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete goal type
export const deleteGoalType = createAsyncThunk(
  "goalType/deleteGoalType",
  async (id, { rejectWithValue }) => {
    try {
      await GoalTypeService.deleteGoalType(id);
      return id; // return deleted id
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const GoalTypeSlice = createSlice({
  name: "goalType",
  initialState: {
    goalTypes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchGoalTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGoalTypes.fulfilled, (state, action) => {
      state.loading = false;
      state.goalTypes = action.payload;
    });
    builder.addCase(fetchGoalTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // add
    builder.addCase(addGoalType.fulfilled, (state, action) => {
      state.goalTypes.push(action.payload);
    });

    // update
    builder.addCase(updateGoalType.fulfilled, (state, action) => {
      const index = state.goalTypes.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) state.goalTypes[index] = action.payload;
    });

    // delete
    builder.addCase(deleteGoalType.fulfilled, (state, action) => {
      state.goalTypes = state.goalTypes.filter(
        (item) => item.id !== action.payload
      );
    });
  },
});

export default GoalTypeSlice.reducer;
