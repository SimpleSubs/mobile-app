import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    value: false
  },
  reducers: {
    startLoading: (state) => {
      state.value = true;
    },
    stopLoading: (state) => {
      state.value = false;
    }
  }
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;