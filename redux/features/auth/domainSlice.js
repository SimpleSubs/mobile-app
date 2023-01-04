import { createSlice } from "@reduxjs/toolkit";

export const domainSlice = createSlice({
  name: "domain",
  initialState: null,
  reducers: {
    setDomain: (_, action) => {
      return action.payload;
    },
    clearDomain: () => {
      return null;
    }
  }
});

export const { setDomain, clearDomain } = domainSlice.actions;

export default domainSlice.reducer;