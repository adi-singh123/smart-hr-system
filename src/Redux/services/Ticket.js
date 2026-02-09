import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

export const Add_ticket = createAsyncThunk(
  "/api/add-tickets",
  async (ticketData, thunkAPI, SearchData) => {
    const { rejectWithValue } = thunkAPI;
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "Post",
        url: `${HTTPURL}add-ticket`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: ticketData,
      };

      const res = await axios.request(config);

      console.log(res);
      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong");
      }

      return res.data;
    } catch (error) {
      // Catch any errors and show the alert
      const errorMessage = error?.response?.data?.message || error?.message;
      customAlert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const get_tickets = createAsyncThunk(
  "api/all-tickets",
  async (filters, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}all-tickets`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: filters,
      };

      const response = await axios.request(config);
      console.log("GETTING DAT", response.data.data);
      return response.data.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "/api/delete-ticket",
  async (ticketId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "DELETE",
        url: `${HTTPURL}delete-ticket/${ticketId}`, // Ensure your API expects the id in the URL (or in data)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      console.log("Delete Ticket Response: ", res);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong");
      }

      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTicket = createAsyncThunk(
  "api/update-ticket",
  async ({ id, data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "PUT",
        url: `${HTTPURL}update-ticket/${id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data,
      };

      const res = await axios.request(config);
      console.log("Update Ticket Response:", res.data);
      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong");
      }
      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage);
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const addTicketChat = createAsyncThunk(
  "/api/add-ticket-chat",
  async (chatData, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}add-ticket-chat`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: chatData,
      };

      const res = await axios.request(config);
      console.log("Add Ticket Chat Response: ", res);

      if (res?.data?.success) {
        customAlert("Message sent successfully!", "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong");
      }

      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const getTicketChat = createAsyncThunk(
  "/api/get-ticket-chat",
  async (ticketId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token || "";

    if (!ticketId) {
      return rejectWithValue("Ticket ID is required");
    }

    console.log("Fetching ticket chat for:", ticketId);
    console.log("API URL:", `${HTTPURL}get-ticket-chat/${ticketId}`);
    const cleanedTicketId = ticketId.replace("#", "");
    const url = `${HTTPURL}/get-ticket-chat/${cleanedTicketId}`;
    try {
      const config = {
        method: "GET",
        url: `${HTTPURL}get-ticket-chat/${cleanedTicketId}`, // Ensure URL is correct
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      console.log("Get Ticket Chat Response: ", res);

      if (res?.data?.success) {
        return res.data.messages;
      } else {
        customAlert(res?.data?.message || "Something went wrong");
        return rejectWithValue(res?.data?.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      console.error("Error fetching ticket chat:", errorMessage);
      customAlert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
