// src/Redux/chat/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchConversations, 
    fetchPrivateMessages, 
    fetchGroupMessages, 
    startCallLog, 
    endCallLog,
    fetchCallHistory
} from "../services/Chats"; // Import the new thunks

const initialState = {
  // REST/Chat State
  conversations: [], 
  activeChat: null,  
  messages: [],      
  onlineUsers: {},   
  callHistory: [],
  loading: false,
  error: null,

  // Call State (Real-time)
  callState: {
    inCall: false,
    isInitiator: false, 
    remoteUser: null,
    callType: null, 
    callLogId: null,      // New: The ID created by startCallLog
    sdpOffer: null, 
    remoteCandidateQueue: [], 
    localStream: null, 
    remoteStream: null, 
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // --- Standard Reducers (for Socket.io and UI updates) ---
    setActiveChat: (state, action) => {
        state.activeChat = action.payload.chatId;
        state.messages = []; // Clear current messages
        state.error = null;
    },
    addMessage: (state, action) => {
      // Only add message if it belongs to the active chat
      if (state.activeChat === action.payload.chatId) {
          state.messages.push(action.payload);
      }
    },
    setOnlineStatus: (state, action) => {
      state.onlineUsers[action.payload.userId] = action.payload.isOnline;
    },

    // --- Call Management (Real-Time UI) ---
    initiateCall: (state, action) => {
      state.callState = {
        ...initialState.callState, // Reset previous state
        inCall: true,
        isInitiator: true,
        remoteUser: action.payload.targetUserId,
        callType: action.payload.callType,
      };
      state.callState.localStream = action.payload.stream;
    },
    receiveCall: (state, action) => {
      state.callState = {
        ...initialState.callState, // Reset previous state
        inCall: true,
        isInitiator: false,
        remoteUser: action.payload.from,
        callType: action.payload.callType,
        sdpOffer: action.payload.offer,
      };
    },
    setLocalStream: (state, action) => {
        state.callState.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
        state.callState.remoteStream = action.payload;
    },
    setCallAnswer: (state, action) => {
        // When the answer is received by the initiator, clear the offer for state management
        state.callState.sdpOffer = null; 
    },
    addRemoteCandidate: (state, action) => {
        state.callState.remoteCandidateQueue.push(action.payload);
    },
    endCall: (state) => {
      // Keep callLogId if needed for a moment, but reset streams and active call status
      state.callState.inCall = false;
      state.callState.localStream = null;
      state.callState.remoteStream = null;
      // Other cleanup done in the component
    },
  },
  
  // --- Extra Reducers (for REST API Thunks) ---
  extraReducers: (builder) => {
    builder
        // Fetch Conversations
        .addCase(fetchConversations.pending, (state) => { state.loading = true; })
        .addCase(fetchConversations.fulfilled, (state, action) => {
            state.loading = false;
            state.conversations = action.payload;
        })
        .addCase(fetchConversations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Fetch Private/Group Messages (Shared logic)
        .addCase(fetchPrivateMessages.pending, (state) => { state.loading = true; })
        .addCase(fetchGroupMessages.pending, (state) => { state.loading = true; })
        .addCase(fetchPrivateMessages.fulfilled, (state, action) => {
            state.loading = false;
            // Only update messages if the fetched chat matches the active one
            if (state.activeChat === action.payload.chatId) {
                state.messages = action.payload.messages;
            }
        })
        .addCase(fetchGroupMessages.fulfilled, (state, action) => {
            state.loading = false;
            if (state.activeChat === action.payload.chatId) {
                state.messages = action.payload.messages;
            }
        })
        .addCase(fetchPrivateMessages.rejected, (state, action) => {
             state.loading = false; state.error = action.payload;
        })
        .addCase(fetchGroupMessages.rejected, (state, action) => {
             state.loading = false; state.error = action.payload;
        })

        // Start Call Log
        .addCase(startCallLog.fulfilled, (state, action) => {
            state.callState.callLogId = action.payload; // Store the ID for ending the call
        })

        // End Call Log
        .addCase(endCallLog.fulfilled, (state) => {
            state.callState.callLogId = null; // Clear the ID after successful logging
        })

        // Fetch Call History
        .addCase(fetchCallHistory.fulfilled, (state, action) => {
            state.callHistory = action.payload;
        });
  },
});

export const { 
  setActiveChat, 
  addMessage, 
  setOnlineStatus,
  initiateCall, 
  receiveCall, 
  setLocalStream,
  setRemoteStream,
  setCallAnswer,
  addRemoteCandidate,
  endCall 
} = chatSlice.actions;

export default chatSlice.reducer;