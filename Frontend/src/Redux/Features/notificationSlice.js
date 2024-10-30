// src/store/notificationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set your backend API URL
const API_URL = import.meta.env.VITE_APP_API_URL;

// Thunk to fetch missed notifications (unread notifications) upon user login
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

      return response.data.message; // Assumes the response contains an array of notifications
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

// Thunk to mark all notifications as read on the backend
export const markAllAsReadBackend = createAsyncThunk(
  "notifications/markAllAsReadBackend",
  async (userId, { rejectWithValue }) => {
    try {
      // Send the request to mark all notifications as read for a given userId
      const response = await axios.post(
        `${API_URL}/notifications/mark-all-as-read/${userId}`,
        null, // no body content needed
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      // Assuming the backend response indicates success in some way, you can use response.data here
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
    list: [],
    unreadCount: 0,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissedNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissedNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
        state.loading = false;
      })
      .addCase(fetchMissedNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
