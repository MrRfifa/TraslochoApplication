// store.js
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./Features/userInfo";
import userSpecInfoReducer from "./Features/userSpecInfo";

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    userSpecInfo: userSpecInfoReducer,
  },
});

export default store;
