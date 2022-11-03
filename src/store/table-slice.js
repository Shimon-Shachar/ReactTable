import { createSlice } from "@reduxjs/toolkit";
//const cl = (definition, arg2) => console.log(`" ${arg2} ${definition}: "`, definition);

const tableSlice = createSlice({
  name: "table",
  initialState: {
    rows: {rowId: false}
  },
  reducers: {  
    updateRowClickedStatus(state, action) {
      // const id =parseInt(action.payload);
      // console.log("id: ", id);
      // state.rows[`${id}`] = {clicked: true}
      // const bool = !state.rows[action.payload]
      // console.clear();
      // console.log("action.payload: " , action.payload, "bool : ", bool ) 
      // state.rows[action.payload] = bool
    },
  },
});

export const tableActions = tableSlice.actions;

export default tableSlice;
