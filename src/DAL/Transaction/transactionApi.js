import { invokeApi } from "../../bl_libs/invokeApi";

export const transactionListApi = async (page, limit, data) => {
  const requestObj = {
    path: `/admin_users/all_transaction_list?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteTransactionApi = async (id) => {
  const requestObj = {
    path: `/admin_users/delete_transaction/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const transactionListFilterPageRequestApi = async () => {
  const requestObj = {
    path: `/admin_users/sale_page_payment_request_listing`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// export const CategoryDeleteApi = async (id) => {
//   const requestObj = {
//     path: `/api/general_category/${id}`,
//     method: "DELETE",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
// export const affirmationCategoryAddApi = async (data) => {
//   const requestObj = {
//     path: `/api/general_category`,
//     method: "POST",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
// export const affirmationCategoryEditApi = async (data, id) => {
//   const requestObj = {
//     path: `/api/general_category/${id}`,
//     method: "PUT",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
