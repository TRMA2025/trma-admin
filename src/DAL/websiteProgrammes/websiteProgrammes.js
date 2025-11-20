import { invokeApi } from "../../bl_libs/invokeApi";

export const websiteProgrammesListApi = async (data) => {
  const requestObj = {
    path: `/api/website_program`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const activeProgrammesCategoryListApi = async (data) => {
  const requestObj = {
    path: `/api/program_category/active_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addWebsiteProgrammesApi = async (data) => {
  const requestObj = {
    path: `/api/website_program`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editWebsiteProgrammesApi = async (data, id) => {
  const requestObj = {
    path: `/api/website_program/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteWebsiteProgrammesApi = async (id) => {
  const requestObj = {
    path: `/api/website_program/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
