import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  helperUserIndex: undefined,
  updateUser: {},
  dbAccountInfo: [],
  users: [
    {
      firstName: "",
      lastName: "",
      organizationCode: "",
      lastLoginDate: "",
      userId: "",
      email: "",
      status: "",
      accountInfo: [
        {
          bank: "",
          accountName: "",
          isDefaultAccount: "",
          accountType: "",
          branch: "",
          account: "",
        },
      ],
    },
  ],
  pageAccountInfo: [],
};
// 264
// 267
// 268
// 205
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setDbUsers(state, action) {
      state.users = [...action.payload]
    },
    loadPageUserAccountInfo(state, action) {
      console.log("in loadPageUserAccountInfo action: ", action.payload);
      state.pageAccountInfo = action.payload;
      console.log("state.pageAccountInfo:", state.pageAccountInfo);
    },
    setUserAccountInfo(state, action) {
      //if i had acccess to "row.values.userId" would search users array for
      // an object with useId that matches and would ...sprad the paylaod from db, however...
      // that is not the case
      
      
      // console.log("in setDBuser action, the id is: ", uid);
      // const index = state.users.findIndex((object) => {
      //   return object.userId === uid;
      // });
      // state.helperUserIndex = index;
      // state.users[index].accountInfo = [...action.payload.accountList];
      // console.log("new useraccount state:", state.users[index].accountInfo);
      
      const index = action.payload;
      console.log("slcie index",index);
      state.users[index].accountInfo = [...state.dbAccountInfo]
    },
    addNewUser(state, action) {
      const uid = action.payload.userId;
      console.log("Uid of row clicked begore addding user :", action.payload);
      const newUser = action.payload.newUser;
      const index =state.users.findIndex((user)=> user.userId === uid);
      console.log("New user push at the following index : ", index);
      state.users.splice(index, 0, newUser)
    },
    updateUser(state, action) {
      //works but deletes old info so you have to edit all fields
      const uid = action.payload.userId;
      console.log("action.payload.uid :", action.payload.userId);
      const index =state.users.findIndex((user)=> user.userId === uid);
      console.log("index =state.users.findIndex((user)=> user.userId === uid):" , index) 
      console.log("action.payload.form : ", action.payload.update)
      state.users[index] = {...state.users[index], ...action.payload.update}
    },
    deleteUser(state, action) {
      const index = action.payload
      const filtered = state.users.filter((user, i) => i!== index );
      state.users = [...filtered];
    },
    saveOldVal(state, action) {
      state.updateUser = state.users[action.payload]
    },
    //same account info for all users preloaded in yseEffect
    dbAccountInfo(state, action) {
      state.dbAccountInfo = action.payload
    }
  },
});

export const usersActions = usersSlice.actions;

export default usersSlice;
