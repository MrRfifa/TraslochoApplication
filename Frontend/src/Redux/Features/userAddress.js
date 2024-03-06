import { createSlice } from "@reduxjs/toolkit";

const userAddressSlice = createSlice({
  name: "userAddress",
  initialState: {
    value: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      };
    },
  },
});

export const { login, logout } = userAddressSlice.actions;
export default userAddressSlice.reducer;
