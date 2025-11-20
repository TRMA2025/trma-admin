import { invokeApi } from "../../bl_libs/invokeApi";

export const ListChild = async (id) => {
  const requestObj = {
    path: `/api/child/get_child/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddChildApi = async (data) => {
  const requestObj = {
    path: `/api/child`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditChildApi = async (data, id) => {
  const requestObj = {
    path: `/api/child/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const DeleteChild = async (id) => {
  const requestObj = {
    path: `/api/child/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DetailChild = async (id) => {
  const requestObj = {
    path: `/api/child/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
