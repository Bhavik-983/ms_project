import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth-slice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
