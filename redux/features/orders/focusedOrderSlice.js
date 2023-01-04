import { createSlice } from "@reduxjs/toolkit";

export const focusedOrderSlice = createSlice({
  name: "focusedOrder",
  initialState: null,
  reducers: {
    focusOrder: (state, action) => action.payload,
    unfocusOrder: (state) => null
  }
});

export const { focusOrder, unfocusOrder } = focusedOrderSlice.actions;

export default focusedOrderSlice.reducer;