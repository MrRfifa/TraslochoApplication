// src/store/notificationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set your backend API URL
const API_URL = import.meta.env.VITE_APP_API_URL;
//TODO update the state when a notification is read in real time.
// Thunk to fetch all notifications (both read and unread)
export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAllNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}Notification/notifications-by-user/${userId}`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      return response.data.message; // Assuming this returns all notifications
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all notifications"
      );
    }
  }
);

// Thunk to fetch only unread (missed) notifications
export const fetchMissedNotifications = createAsyncThunk(
  "notifications/fetchMissedNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}Notification/non-read-notifications-by-user/${userId}`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      return response.data.message; // Assuming this returns unread notifications
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch missed notifications"
      );
    }
  }
);

// Thunk to mark all notifications as read on the backend
export const markAllAsReadBackend = createAsyncThunk(
  "notifications/markAllAsReadBackend",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications/mark-all-as-read/${userId}`,
        null, // No body content needed
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to mark notifications as read"
      );
    }
  }
);

// Notifications slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [], // All notifications (read and unread)
    unreadCount: 0, // Count of unread notifications
    missedNotifications: [], // Separate state for unread notifications only, if needed
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.push(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
      state.missedNotifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notifications (both read and unread)
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
        state.loading = false;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch only unread (missed) notifications
      .addCase(fetchMissedNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissedNotifications.fulfilled, (state, action) => {
        state.missedNotifications = action.payload;
        const unreadSet = new Set(action.payload.map((n) => n.id));

        // Merge unread notifications into the full list, preserving read notifications
        state.list = [
          ...state.list.filter((n) => !unreadSet.has(n.id)), // Keep only non-duplicates from list
          ...action.payload, // Add unread notifications from payload
        ];

        state.unreadCount = action.payload.length;
        state.loading = false;
      })
      .addCase(fetchMissedNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark all notifications as read
      .addCase(markAllAsReadBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllAsReadBackend.fulfilled, (state) => {
        state.unreadCount = 0;
        state.list = state.list.map((notification) => ({
          ...notification,
          read: true,
        }));
        state.loading = false;
      })
      .addCase(markAllAsReadBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNotification, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
