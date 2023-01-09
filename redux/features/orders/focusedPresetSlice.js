import { createSlice } from "@reduxjs/toolkit";

export const focusedPresetSlice = createSlice({
  name: "focusedPreset",
  initialState: null,
  reducers: {
    focusPreset: (_, action) => action.payload,
    unfocusPreset: () => null
  }
});

export const { focusPreset, unfocusPreset } = focusedPresetSlice.actions;

export default focusedPresetSlice.reducer;