import { createSlice } from "@reduxjs/toolkit";

export const modalOperationsSlice = createSlice({
  name: "modalOperations",
  initialState: {
    key: null,
    returnValue: null
  },
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload;
      state.returnValue = null;
    },
    setReturnValue: (state, action) => {
      state.returnValue = action.payload;
    },
    clearOperation: (state, action) => {
      state.key = null;
      state.returnValue = null;
    }
  }
});

export const { setKey, setReturnValue, clearOperation } = modalOperationsSlice.actions;

export default modalOperationsSlice.reducer;