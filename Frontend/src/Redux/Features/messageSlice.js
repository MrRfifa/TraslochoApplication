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

// Messages slice
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversation: [], // Messages in the conversation
    // unreadCount: 0, // Count of unread messages
    lastSeenTimestamps: {},
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
    updateLastSeenTimestamp(state, action) {
      const { participantId, time } = action.payload;
      state.lastSeenTimestamps[participantId] = time;
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
      });
  },
});

// Exporting the actions
export const {
  addMessage,
  clearConversation,
  setConnectedUsers,
  updateLastSeenTimestamp,
} = messageSlice.actions;

export default messageSlice.reducer;
