/** @format */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTrainings,
  addTraining,
  updateTraining,
  deleteTraining,
} from "../services/Training";

// ✅ Async thunks
export const fetchTrainings = createAsyncThunk(
  "training/fetchTrainings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTrainings();
      return res.data; // array of trainings
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTraining = createAsyncThunk(
  "training/createTraining",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addTraining(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editTraining = createAsyncThunk(
  "training/editTraining",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await updateTraining(id, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeTraining = createAsyncThunk(
  "training/removeTraining",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTraining(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Slice
const trainingSlice = createSlice({
  name: "training",
  initialState: {
    trainings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchTrainings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create
    builder
      .addCase(createTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings.push(action.payload);
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // edit
    builder
      .addCase(editTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTraining.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trainings.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) state.trainings[index] = action.payload;
      })
      .addCase(editTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // delete
    builder
      .addCase(removeTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings = state.trainings.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(removeTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trainingSlice.reducer;
