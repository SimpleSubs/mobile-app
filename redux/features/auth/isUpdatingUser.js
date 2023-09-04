import { createSlice } from '@reduxjs/toolkit';

// Slice for if the app is *currently* authenticating into a user.
// This prevents the app from doing anything until the user is fully created in the database.
// Should be used when creating a user or on the UpdateUserScreen.
export const isUpdatingUserSlice = createSlice({
  name: 'isUpdatingUser',
  initialState: {
    value: false,
  },
  reducers: {
    setUpdatingUser: (state, { payload }) => {
      state.value = payload;
    },
  },
});

export const { setUpdatingUser } = isUpdatingUserSlice.actions;

export default isUpdatingUserSlice.reducer;
