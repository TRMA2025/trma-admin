import { invokeApi } from "../../bl_libs/invokeApi";

export const teamListApi = async (data) => {
  const requestObj = {
    path: `/api/team`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addTeamApi = async (data) => {
  const requestObj = {
    path: `/api/team`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editTeamApi = async (data, id) => {
  const requestObj = {
    path: `/api/team/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteTeamApi = async (id) => {
  const requestObj = {
    path: `/api/team/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
