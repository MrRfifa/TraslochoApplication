// store.js
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./Features/userInfo";
import userSpecInfoReducer from "./Features/userSpecInfo";
import userAddressReducer from "./Features/userAddress";
import notificationReducer from "./Features/notificationSlice";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    userSpecInfo: userSpecInfoReducer,
    userAddress: userAddressReducer,
    notification: notificationReducer,
  },
});

export default store;
