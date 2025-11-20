import { invokeApi } from "../../bl_libs/invokeApi";

export const categoryListApi = async (data) => {
  const requestObj = {
    path: `/api/general_category`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// export const gratitudeDetailApi = async (id) => {
//   const requestObj = {
//     path: `/api/general_gratitude/${id}`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
export const CategoryDeleteApi = async (id) => {
  const requestObj = {
    path: `/api/general_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const affirmationCategoryAddApi = async (data) => {
  const requestObj = {
    path: `/api/general_category`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const affirmationCategoryEditApi = async (data, id) => {
  const requestObj = {
    path: `/api/general_category/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
