import { httpService } from "./baseHttp";

const dbobj = {
  firebase: {
    users: {
      url: "users.json",
    },
    user: {
      url: "user.json",
    },
  },
  ivory: {
    users: {
      endpoint: "admin_get_organization_users",
      reqObj: {
        content: {
          organizationCode: "Ivory",
          pageNum: "1",
          searchText: "",
        },
      },
    },
    user: {
      endpoint: "admin_get_user_accounts",
      reqObj: { content: { userId: "268" } },
    },
  },
};

const { endpoint, reqObj } = dbobj.ivory.users;
const { endpoint: endpointUser, reqObj: reqObjUser } = dbobj.ivory.user;

export const getUsers = (pageNum = "1") => {
  //console.log("getUsers sending to htttpService --> getting users pageNum is:", pageNum);
  reqObj.content.pageNum = pageNum.toString();
  //console.log(reqObj);
  return httpService.post(endpoint, reqObj);
};

export const getUserAccounInfo = (userId = "268") => {
  console.log("getUserAccountInfo sending to htttpService -->getting account info userId is:", userId);
  reqObjUser.content.userId = userId.toString();
  // console.log(reqObjUser);
  return httpService.post(endpointUser, reqObjUser);
};

export const getUsersSearch = (searchText="") => {
  console.log("getUserSearch.. sending to htttpService -->getting use info by searchText:", searchText );
  reqObj.content.searchText = searchText.toString();
    // console.log(reqObjUser);
    return httpService.post(endpoint, reqObj);
  };

