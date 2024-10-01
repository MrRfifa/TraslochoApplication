// Redux/Features/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    setNotifications: (state, action) => {
      console.log(state);
      
      state.notifications = action.payload; // Set the notifications when the user logs in
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, setNotifications, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
