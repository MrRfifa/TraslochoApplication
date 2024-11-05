// src/store/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MessageService from "../../Services/Messages/Messages";

// Thunk to fetch previous messages between two users by contact ID
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ contactId }, { rejectWithValue }) => {
    try {
      const response = await MessageService.getMessages(contactId);
      // console.log(response);
      
      if (response.success) {
        return response.message; // Array of messages
      } else {
        return rejectWithValue(response.error || "Failed to fetch messages");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching messages"
      );
    }
  }
);

// Thunk to mark a message as read on the server
export const markMessageAsReadOnServer = createAsyncThunk(
  "messages/markMessageAsRead",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await MessageService.markMessageAsRead(messageId);
      if (response.success) {
        return messageId; // Return the message ID to update in state
      } else {
        return rejectWithValue(response.error || "Failed to mark message as read");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while marking message as read"
      );
    }
  }
);

// Messages slice
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversation: [], // Messages in the conversation
    unreadCount: 0, // Count of unread messages
    loading: false,
    error: null,
    connectedUsers: [], // Connected users list
  },
  reducers: {
    addMessage: (state, action) => {
      state.conversation.push(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1; // Increment unread count if the message is unread
      }
    },
    clearConversation: (state) => {
      state.conversation = [];
      state.unreadCount = 0;
    },
    setConnectedUsers: (state, action) => {
      state.connectedUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.conversation = action.payload;        
        state.unreadCount = action.payload.filter((msg) => !msg.read).length; // Set unread count based on unread messages
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markMessageAsReadOnServer.fulfilled, (state, action) => {
        // Update the specific message in the conversation to mark it as read
        const message = state.conversation.find(
          (msg) => msg.id === action.payload
        );
        if (message && !message.read) {
          message.read = true;
          state.unreadCount = Math.max(state.unreadCount - 1, 0); // Ensure unread count doesn't go below 0
        }
      })
      .addCase(markMessageAsReadOnServer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Exporting the actions
export const {
  addMessage,
  clearConversation,
  setConnectedUsers,
} = messageSlice.actions;

export default messageSlice.reducer;
