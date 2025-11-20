import { invokeApi } from "../../bl_libs/invokeApi";

export const editDepartmentApi = async (data, id) => {
  const requestObj = {
    path: `/api/department/edit_department/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addDepartmentApi = async (data) => {
  const requestObj = {
    path: `/api/department/add_department`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const activeSupportTeamListApi = async (data) => {
  const requestObj = {
    path: `/api/consultant/active_consultant_support_team_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const departmentListingApi = async (data) => {
  const requestObj = {
    path: `/api/department/list_department`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const departmentDeleteApi = async (id) => {
  const requestObj = {
    path: `/api/department/delete_department/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
