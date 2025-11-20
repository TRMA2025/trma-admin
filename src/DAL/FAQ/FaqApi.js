import { invokeApi } from "../../bl_libs/invokeApi";

export const getFaqListApi = async (data) => {
  const requestObj = {
    path: `/api/faq/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const getFaqSalePageListApi = async (id) => {
  const requestObj = {
    path: `/api/faq/faq_list_by_sale_page/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addFaqApi = async (data) => {
  const requestObj = {
    path: `/api/faq/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateFaqApi = async (data, id) => {
  const requestObj = {
    path: `/api/faq/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteFaqApi = async (id) => {
  const requestObj = {
    path: `/api/faq/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
