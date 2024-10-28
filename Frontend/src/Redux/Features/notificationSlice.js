// src/store/notificationsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.push(action.payload);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
      state.list = state.list.map(notification => ({ ...notification, read: true }));
    },
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
