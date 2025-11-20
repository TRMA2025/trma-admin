import { invokeApi } from "../../bl_libs/invokeApi";

export const GroupAutomatedListingApi = async (data) => {
  const requestObj = {
    path: `/api/group/active_automated_group_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const GroupListingApi = async (page, rowsPerPage, searchText) => {
  const requestObj = {
    path: `/api/group?page=${page}&limit=${rowsPerPage}&search=${searchText}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const activeGroupListingApi = async (data) => {
  const requestObj = {
    path: `/api/group/active_group_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddGroupApi = async (data) => {
  const requestObj = {
    path: `/api/group`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditGroupApi = async (data, slug) => {
  const requestObj = {
    path: `/api/group/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteGroupApi = async (slug) => {
  const requestObj = {
    path: `/api/group/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
