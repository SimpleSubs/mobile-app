import { createSlice } from "@reduxjs/toolkit";

export const orderPresetsSlice = createSlice({
  name: "orderPresets",
  initialState: {},
  reducers: {
    updatePresets: (state, action) => {
      const presets = {};
      for (const doc of action.payload) {
        presets[doc.key] = doc;
      }
      return presets;
    }
  }
});

export const { updatePresets } = orderPresetsSlice.actions;

export default orderPresetsSlice.reducer;