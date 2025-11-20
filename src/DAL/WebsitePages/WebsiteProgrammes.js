import { invokeApi } from "../../bl_libs/invokeApi";

export const websiteProgrammesListApi = async (id) => {
  let api_path = `/api/website_program`;
  if (id) {
    api_path = `/api/website_program/list_by_sale_page/${id}`;
  }
  const requestObj = {
    path: api_path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const website_programmes_detail_api = async (id) => {
  const requestObj = {
    path: `/api/website_program/get_program/${id}`,
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
