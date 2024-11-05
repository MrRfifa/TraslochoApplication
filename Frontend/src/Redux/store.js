// store.js
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./Features/userInfo";
import userSpecInfoReducer from "./Features/userSpecInfo";
import userAddressReducer from "./Features/userAddress";
import notificationsReducer from "./Features/notificationSlice";
import messageReducer from "./Features/messageSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    userSpecInfo: userSpecInfoReducer,
    userAddress: userAddressReducer,
    notifications: notificationsReducer,
    messages: messageReducer,
  },
});

export default store;
