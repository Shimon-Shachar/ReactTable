import { configureStore } from "@reduxjs/toolkit";
import tableSlice from "./table-slice";
import usersSlice from "./users-slice";

const store = configureStore({
  reducer: {
    table: tableSlice.reducer,
    users: usersSlice.reducer,
  },
});
export default store;
