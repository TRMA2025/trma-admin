import { invokeApi } from "../../bl_libs/invokeApi";

export const supportTicketListApi = async (
  data,
  page,
  rowsPerPage,
  searchText
) => {
  const requestObj = {
    path: `/api/support_ticket/get_list_support_ticket_v1?page=${page}&limit=${rowsPerPage}&search_text=${searchText}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const resolve = async (data) => {
  const requestObj = {
    path: `/api/support_ticket/mark_resolve`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const addSupportTicketComment = async (data) => {
  const requestObj = {
    path: `/api/support_ticket/add_support_ticket_comment_new`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateSupportTicketComment = async (data, id) => {
  const requestObj = {
    path: `/api/support_ticket/edit_support_ticket_comment_for_admin/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteSupportTicketComment = async (id) => {
  const requestObj = {
    path: `/api/support_ticket/delete_support_ticket_comment_for_admin/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    // postData: data,
  };
  return invokeApi(requestObj);
};
// export const UpdateCommentAPI = async (data) => {
//   const requestObj = {
//     path: `/api/support_ticket/add_support_ticket_comment_new`,
//     method: "POST",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
export const supportTicketDetailApi = async (id) => {
  const requestObj = {
    path: `/api/support_ticket/detail_support_ticket/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
