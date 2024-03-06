import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    value: { id: 0, role: "" },
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = { id: 0, role: "" };
    },
  },
});

export const { login, logout } = userInfoSlice.actions;
export default userInfoSlice.reducer;
