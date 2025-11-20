import { invokeApi } from "../../bl_libs/invokeApi";

export const gratitudeListApi = async (data) => {
  const requestObj = {
    path: `/api/general_gratitude`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const gratitudeDetailApi = async (id) => {
  const requestObj = {
    path: `/api/general_gratitude/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const gratitudeDeleteApi = async (id) => {
  const requestObj = {
    path: `/api/general_gratitude/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const gratitudeAddApi = async (data) => {
  const requestObj = {
    path: `/api/general_gratitude`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const gratitudeEditApi = async (data, id) => {
  const requestObj = {
    path: `/api/general_gratitude/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
