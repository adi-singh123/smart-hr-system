/** @format */

// Redux/services/TrainingTypeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getTrainingTypes,
  addTrainingType,
  updateTrainingType,
  deleteTrainingType,
} from "../services/TrainingType";

// ✅ Async Thunks
export const fetchTrainingTypes = createAsyncThunk(
  "trainingType/fetchTrainingTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTrainingTypes();
      return res.data; // returning the actual array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTrainingType = createAsyncThunk(
  "trainingType/createTrainingType",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addTrainingType(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editTrainingType = createAsyncThunk(
  "trainingType/editTrainingType",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await updateTrainingType(id, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeTrainingType = createAsyncThunk(
  "trainingType/removeTrainingType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteTrainingType(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Slice
const trainingTypeSlice = createSlice({
  name: "trainingType",
  initialState: {
    trainingTypes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchTrainingTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.trainingTypes = action.payload;
      })
      .addCase(fetchTrainingTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add
    builder
      .addCase(createTrainingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrainingType.fulfilled, (state, action) => {
        state.loading = false;
        state.trainingTypes.push(action.payload);
      })
      .addCase(createTrainingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(editTrainingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTrainingType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trainingTypes.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) state.trainingTypes[index] = action.payload;
      })
      .addCase(editTrainingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(removeTrainingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTrainingType.fulfilled, (state, action) => {
        state.loading = false;
        state.trainingTypes = state.trainingTypes.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(removeTrainingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trainingTypeSlice.reducer;
