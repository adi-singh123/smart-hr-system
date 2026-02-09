/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClients,
  addOrUpdateClient,
  deleteClient,
  fetchNewClientId,
  fetchClientById, // ✅ import naya thunk
} from "../services/Client";

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    selectedClient: null, // 🔹 yaha single client ke liye state
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add or update client
      .addCase(addOrUpdateClient.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(addOrUpdateClient.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Delete client
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Fetch new client ID
      .addCase(fetchNewClientId.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(fetchNewClientId.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Fetch client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.selectedClient = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload.data;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default clientsSlice.reducer;
