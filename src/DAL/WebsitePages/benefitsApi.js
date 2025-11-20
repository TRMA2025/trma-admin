import { invokeApi } from "../../bl_libs/invokeApi";

export const getBenefitListApi = async (id) => {
  let api_path = `/api/faq`;
  if (id) {
    api_path = `/api/benifits/list_by_sale_page/${id}`;
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
export const addBenefitApi = async (data) => {
  const requestObj = {
    path: `/api/benifits`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateBenefitsApi = async (data, id) => {
  const requestObj = {
    path: `/api/benifits/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const benefitsDetailApi = async (id) => {
  console.log(id, "result");
  const requestObj = {
    path: `/api/benifits/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deletBenifitsApi = async (id) => {
  const requestObj = {
    path: `/api/benifits/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
