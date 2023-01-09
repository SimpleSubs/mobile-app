import { createSlice } from "@reduxjs/toolkit";

export const CLOSED_INFO_MODAL = "    ";

export const infoMessageSlice = createSlice({
  name: "infoMessage",
  initialState: {
    value: CLOSED_INFO_MODAL
  },
  reducers: {
    setInfoMessage: (state, action) => {
      state.value = action.payload;
    },
    clearInfoMessage: (state) => {
      state.value = CLOSED_INFO_MODAL;
    }
  }
});

export const { setInfoMessage, clearInfoMessage } = infoMessageSlice.actions;

export default infoMessageSlice.reducer;