import { invokeApi } from "../../bl_libs/invokeApi";

export const addWebsitePodCast = async (data) => {
  const requestObj = {
    path: `/api/website_pods/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editWebsitePodCast = async (data, id) => {
  const requestObj = {
    path: `/api/website_pods`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const listWebsitePodCast = async (search, rowsPerPage, page) => {
  const requestObj = {
    path: `/api/website_pods?page=${page}&limit=${rowsPerPage}&search_text=${
      search == undefined || search == "" ? "" : search
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteWebsitePodCast = async (id) => {
  const requestObj = {
    path: `/api/website_pods/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
