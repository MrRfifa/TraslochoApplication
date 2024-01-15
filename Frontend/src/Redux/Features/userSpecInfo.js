import { createSlice } from "@reduxjs/toolkit";

const userSpecInfoSlice = createSlice({
  name: "userSpecInfo",
  initialState: {
    value: {
      email: "",
      firstName: "",
      lastName: "",
      filename: "",
      fileContentBase64: null,
    },
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = {
        email: "",
        firstName: "",
        lastName: "",
        filename: "",
        fileContentBase64: null,
      };
    },
  },
});

export const { login, logout } = userSpecInfoSlice.actions;
export default userSpecInfoSlice.reducer;
