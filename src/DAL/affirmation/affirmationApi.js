import { invokeApi } from "../../bl_libs/invokeApi";

export const affirmationListApi = async (data) => {
  const requestObj = {
    path: `/api/general_affirmation`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AffirmationDetailApi = async (id) => {
  const requestObj = {
    path: `/api/general_affirmation/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const affirmationDeleteApi = async (id) => {
  const requestObj = {
    path: `/api/general_affirmation/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const affirmationAddApi = async (data) => {
  const requestObj = {
    path: `/api/general_affirmation/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AffirmationEditApi = async (data, id) => {
  const requestObj = {
    path: `/api/general_affirmation/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
