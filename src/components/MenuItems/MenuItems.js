import { invokeApi } from "../../bl_libs/invokeApi";

export const addMenuApi = async (data) => {
  const requestObj = {
    path: `/api/menu/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editMenuApi = async (data, id) => {
  const requestObj = {
    path: `/api/menu/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const getMenuListApi = async (data) => {
  const requestObj = {
    path: `/api/menu`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const getBookCallTypeListApi = async (data) => {
  const requestObj = {
    path: `/api/book_call_type/list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteMenuApi = async (id) => {
  const requestObj = {
    path: `/api/menu/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
