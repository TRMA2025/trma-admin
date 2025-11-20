import { invokeApi } from "../../bl_libs/invokeApi";
export const whatsIncludeListApi = async (id) => {
  const requestObj = {
    path: `/api/whats_include/sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addWhatsIncludeApi = async (data) => {
  const requestObj = {
    path: `/api/whats_include`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editWhatsIncludeApi = async (data, id) => {
  const requestObj = {
    path: `/api/whats_include/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteWhatsIncludeApi = async (id) => {
  const requestObj = {
    path: `/api/whats_include/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
