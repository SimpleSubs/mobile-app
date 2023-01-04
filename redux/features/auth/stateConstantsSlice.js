import { createSlice } from "@reduxjs/toolkit";

export const stateConstantsSlice = createSlice({
  name: "stateConstants",
  initialState: {},
  reducers: {
    updateConstants: (_, action) => {
      return action.payload;
    }
  }
});

export const { updateConstants } = stateConstantsSlice.actions;

export default stateConstantsSlice.reducer;