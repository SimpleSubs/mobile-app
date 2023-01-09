import { createSlice } from "@reduxjs/toolkit";

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