// src/utils/socketManager.js
import { io } from "socket.io-client";
import {
  addMessage,
  setOnlineStatus,
  receiveCall,
  endCall,
  addRemoteCandidate,
  setCallAnswer, // keep naming aligned with slice
} from "../Redux/features/ChatsSlice"; // ✅ check filename consistency!

const SOCKET_URL = "http://localhost:5000";
let socket = null;

/**
 * Connects to the Socket.IO server and wires up all listeners.
 */
export const connectSocket = (dispatch, userId, token) => {
  if (socket) return socket; // prevent duplicate connections

  socket = io(SOCKET_URL, {
    query: { token },
    transports: ["websocket"], // ensures proper connection
  });

  socket.on("connect", () => {
    console.log("Socket.io connected:", socket.id);

    // Authenticate user for chat + calls
    socket.emit("authenticate_user", userId);
    socket.emit("authenticate_call_user", userId);
  });

  // --- 🔹 Messaging ---
  socket.on("receive_private_message", (payload) => {
    dispatch(addMessage({ ...payload, chatId: payload.from }));
  });

  socket.on("receive_group_message", (payload) => {
    dispatch(addMessage({ ...payload, chatId: payload.groupId }));
  });

  socket.on("user_status_update", (payload) => {
    dispatch(setOnlineStatus(payload));
  });

  // --- 🔹 Call Signaling ---
  socket.on("incoming_call", (payload) => {
    console.log("Incoming call:", payload);
    dispatch(receiveCall(payload));
  });

  socket.on("call_answered", (payload) => {
    console.log("Call answered:", payload);
    // Save SDP Answer into Redux → handled later in webRTCHelpers
    dispatch(setCallAnswer(payload.answer));
  });

  socket.on("receive_candidate", (payload) => {
    console.log("Received ICE candidate:", payload);
    // Queue candidate in Redux until remoteDescription is ready
    dispatch(addRemoteCandidate(payload.candidate));
  });

  socket.on("call_ended", () => {
    console.log("Call ended by remote peer");
    dispatch(endCall());
  });

  socket.on("disconnect", () => {
    console.log("Socket.io disconnected.");
  });

  return socket;
};

export const getSocket = () => socket;
