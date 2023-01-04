import { createSlice } from "@reduxjs/toolkit";

export const orderPresetsSlice = createSlice({
  name: "orderPresets",
  initialState: {},
  reducers: {
    updatePresets: (state, action) => {
      const presets = {};
      for (const { id, ...doc } of action.payload) {
        presets[id] = { ...doc, key: id };
      }
      return presets;
    }
  }
});

export const { updatePresets } = orderPresetsSlice.actions;

export default orderPresetsSlice.reducer;