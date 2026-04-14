import { configureStore } from "@reduxjs/toolkit";
import events from "./redux";
export const store = configureStore({
  reducer: { events },
});
