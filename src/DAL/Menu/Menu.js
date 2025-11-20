import { invokeApi } from "../../bl_libs/invokeApi";

export const menuList = async (data) => {
  const requestObj = {
    path: `/app/get_menu_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const defaultMenuListApi = async (data) => {
  const requestObj = {
    path: `/app/get_menu_list/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
