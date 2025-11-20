import { invokeApi } from "../../bl_libs/invokeApi";

export const getSuccessScheduleListApi = async (id) => {
  let api_path = `/api/faq`;
  if (id) {
    api_path = `/api/success_schedule/list_by_sale_page/${id}`;
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
export const addSuccessScheduleApi = async (data) => {
  const requestObj = {
    path: `/api/success_schedule`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateSuccessScheduleApi = async (data, id) => {
  const requestObj = {
    path: `/api/success_schedule/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const successScheduleDetailApi = async (id) => {
  console.log(id, "result");
  const requestObj = {
    path: `/api/success_schedule/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteSuccessScheduleApi = async (id) => {
  const requestObj = {
    path: `/api/success_schedule/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
