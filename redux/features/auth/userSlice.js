import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    logIn: () => ({}),
    logOut: () => null,
    updateUserData: (state, action) => {
      const data = action.payload;
      if (!data) {
        return state;
      }
      const auth = getAuth();
      return { uid: auth.currentUser.uid, email: auth.currentUser.email, ...data };
    }
  }
});

export const { logIn, logOut, updateUserData } = userSlice.actions;

export default userSlice.reducer;