// src/Redux/services/ChatServices.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher"; // Assuming this is your base URL

// Utility function to get auth headers
const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState()?.auth?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// 📥 Fetch Conversation List (Simplified: returns a list of users/groups)
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, thunkAPI) => {
    try {
      // NOTE: Your backend needs a REST endpoint to list chats/contacts for the user.
      const { data } = await axios.get(`${HTTPURL}/users/contacts`, getAuthHeaders(thunkAPI));
      // Assuming data.data returns a list of contacts/conversations
      return data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📥 Fetch Private Message History (Uses your backend route: GET /private?user1={id}&user2={id})
export const fetchPrivateMessages = createAsyncThunk(
  "chat/fetchPrivateMessages",
  async ({ user1, user2 }, thunkAPI) => {
    try {
      const { data } = await axios.get(`${HTTPURL}/private?user1=${user1}&user2=${user2}`, getAuthHeaders(thunkAPI));
      return { chatId: user2, messages: data }; // Return messages and the chat context
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📥 Fetch Group Message History (Uses your backend route: GET /group/:group_id)
export const fetchGroupMessages = createAsyncThunk(
  "chat/fetchGroupMessages",
  async (groupId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${HTTPURL}/group/${groupId}`, getAuthHeaders(thunkAPI));
      return { chatId: groupId, messages: data }; // Return messages and the chat context
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📞 REST: Start Call Logging (Uses your backend route: POST /call)
export const startCallLog = createAsyncThunk(
  "chat/startCallLog",
  async ({ caller_id, receiver_id, type }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${HTTPURL}/call`, { caller_id, receiver_id, type }, getAuthHeaders(thunkAPI));
      // Returns the newly created Call ID from the server
      return data.data.id; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📞 REST: End Call Logging (Uses your backend route: PUT /call/:callId/end)
export const endCallLog = createAsyncThunk(
  "chat/endCallLog",
  async (callId, thunkAPI) => {
    try {
      await axios.put(`${HTTPURL}/call/${callId}/end`, {}, getAuthHeaders(thunkAPI));
      return callId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📞 REST: Fetch Call History (Uses your backend route: GET /call/history/:userId)
export const fetchCallHistory = createAsyncThunk(
    "chat/fetchCallHistory",
    async (userId, thunkAPI) => {
      try {
        const { data } = await axios.get(`${HTTPURL}/call/history/${userId}`, getAuthHeaders(thunkAPI));
        return data.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );