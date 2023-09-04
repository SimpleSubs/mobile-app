import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";

// Slice for storing user data. It will be populated with an empty array if firebase-auth is authenticated to a user
// Full user data is fetched from the loading screen component, meaning this could be an empty array if the data doesn't fully exist yet
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