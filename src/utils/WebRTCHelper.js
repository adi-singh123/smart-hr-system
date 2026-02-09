// src/utils/webRTCHelpers.js
// --------------------------------------------------------------------------
// WebRTC Helper Functions for Call Handling
// --------------------------------------------------------------------------

let peerConnection = null;
let localStream = null;
let remoteStream = null;

// STUN/TURN servers (add your own TURN if needed for production)
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // Google STUN
  ],
};

// --------------------------------------------------------------------------
// Initialize Peer Connection
// --------------------------------------------------------------------------
export const initializePeerConnection = (onTrackCallback, onIceCandidateCallback) => {
  peerConnection = new RTCPeerConnection(iceServers);

  // Remote media stream
  remoteStream = new MediaStream();
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    if (onTrackCallback) onTrackCallback(remoteStream);
  };

  // ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate && onIceCandidateCallback) {
      onIceCandidateCallback(event.candidate);
    }
  };

  return peerConnection;
};

// --------------------------------------------------------------------------
// Get Local Stream
// --------------------------------------------------------------------------
export const getLocalStream = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return localStream;
  } catch (err) {
    console.error("Error accessing local media:", err);
    throw err;
  }
};

// --------------------------------------------------------------------------
// Add Local Tracks to Peer Connection
// --------------------------------------------------------------------------
export const addLocalTracks = () => {
  if (!peerConnection || !localStream) return;
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
};

// --------------------------------------------------------------------------
// Create and Send Offer
// --------------------------------------------------------------------------
export const createAndSendOffer = async (sendOfferCallback) => {
  if (!peerConnection) return;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  if (sendOfferCallback) sendOfferCallback(offer);
};

// --------------------------------------------------------------------------
// Handle Incoming Offer
// --------------------------------------------------------------------------
export const handleIncomingOffer = async (offer, sendAnswerCallback) => {
  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  if (sendAnswerCallback) sendAnswerCallback(answer);
};

// --------------------------------------------------------------------------
// Handle Received Answer (with Candidate Queue Processing)
// --------------------------------------------------------------------------
/**
 * Handles the received SDP Answer from the callee and adds the candidate queue.
 * @param {RTCSessionDescriptionInit} answer - The SDP Answer object.
 * @param {Array} candidateQueue - The queue of candidates from Redux state.
 */
export const handleReceivedAnswer = async (answer, candidateQueue = []) => {
  if (!peerConnection || peerConnection.remoteDescription) return;

  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

  // Process queued candidates that arrived before the answer
  candidateQueue.forEach((candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
      console.error("Error adding queued ICE candidate:", e)
    );
  });

  // ✅ Redux should clear the candidateQueue after this
};

// --------------------------------------------------------------------------
// Add Remote ICE Candidate
// --------------------------------------------------------------------------
/**
 * Adds a remote ICE candidate received from the signaling server.
 * This is used for candidates received *after* the remote description is set.
 */
export const addRemoteCandidate = (candidate) => {
  if (peerConnection && peerConnection.remoteDescription) {
    peerConnection
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch((e) => console.error("Error adding received ICE candidate:", e));
  }
  // If remoteDescription is NOT set, queueing is handled in Redux
};

// --------------------------------------------------------------------------
// Close Call
// --------------------------------------------------------------------------
export const closeCall = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  remoteStream = null;
};

