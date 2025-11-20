import { invokeApi } from "../../bl_libs/invokeApi";

export const getFaqListApi = async (id) => {
  let api_path = `/api/faq`;
  if (id) {
    api_path = `/api/faq/faq_list_by_sale_page/${id}`;
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

export const FaqDetailApi = async (id) => {
  console.log(id, "result");
  const requestObj = {
    path: `/api/faq/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
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
