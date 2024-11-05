// src/services/socketService.js
import io from "socket.io-client";
import {
  addMessage,
  setConnectedUsers,
} from "../../Redux/Features/messageSlice";
import store from "../../Redux/store";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL;
let socket = null;

export const startSocketConnection = (userId) => {
  if (!userId) {
    console.error("Cannot start socket connection without a valid user ID");
    return;
  }
  if (!socket) {
    socket = io.connect(`${SOCKET_URL}?id=${userId}`);
    // socket = io(SOCKET_URL, { query: { userId } });

    socket.on("receive_message", (message) => {
      console.log("Received message:", message);
      store.dispatch(addMessage(message)); // Dispatch to Redux store
    });

    socket.on("connection", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on("updateConnectedUsers", (connectedUsers) => {
      store.dispatch(setConnectedUsers(connectedUsers)); // Dispatch action to update connected users
      console.log("Connected users list updated:", connectedUsers);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
};

// Join a specific chat room
export const joinRoom = async (roomId) => {
  if (socket) {
    if (roomId !== "") {
      await socket.emit("join_room", roomId);
      console.log(`Joined room with ID: ${roomId}`);
    }
  }
};

// Send a message to a room
export const sendMessage = async (contact, sender, content) => {
  if (socket) {
    const messageData = { contact, sender, content };
    await socket.emit("send_message", messageData);
    // store.dispatch(addMessage(messageData)); // Add message to Redux store for the sender
  }
};

export const stopSocketConnection = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket connection stopped");
  }
};
