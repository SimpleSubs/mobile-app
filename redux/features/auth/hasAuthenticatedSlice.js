import { createSlice } from "@reduxjs/toolkit";

// Slice for if firebase-auth has checked if logged in
// This can be true even if the user isn't logged in, it just means that the authentication has been checked from cookies, for example
export const hasAuthenticatedSlice = createSlice({
  name: "hasAuthenticated",
  initialState: {
    value: false
  },
  reducers: {
    authenticate: (state) => {
      state.value = true;
    }
  }
});

export const { authenticate } = hasAuthenticatedSlice.actions;

export default hasAuthenticatedSlice.reducer;