import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false
  },
  reducers: {
    openModal: (state, action) => ({ ...action.payload, open: true }),
    closeModal: (state) => {
      state.open = false;
    },
    setModalProps: (state, action) => action.payload
  }
});

export const { openModal, closeModal, setModalProps } = modalSlice.actions;

export default modalSlice.reducer;