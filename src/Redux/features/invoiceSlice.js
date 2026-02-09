import { createSlice } from "@reduxjs/toolkit";
import {
  fetchInvoices,
  fetchInvoiceById,
  createInvoice,
  updateInvoice,
} from "../services/Invoice.js"; // assumes these thunks are in services/Invoice.js

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [],
    selectedInvoice: null,
    loading: false,
    error: null,
    message: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload.data;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createInvoice.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.invoices.push(action.payload.data);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const updated = action.payload.data;
        state.invoices = state.invoices.map((inv) =>
          inv.id === updated.id ? updated : inv
        );
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;
