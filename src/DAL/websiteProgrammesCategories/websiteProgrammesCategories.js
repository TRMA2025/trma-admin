import { invokeApi } from "../../bl_libs/invokeApi";

export const websiteProgrammesCategoriesListApi = async (data) => {
  const requestObj = {
    path: `/api/program_category`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
// export const activeProgrammesCategoryListApi = async (data) => {
//   const requestObj = {
//     path: `/api/program_category/active_list`,
//     method: "GET",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//   };
//   return invokeApi(requestObj);
// };
export const addWebsiteProgrammesCategoryApi = async (data) => {
  const requestObj = {
    path: `/api/program_category`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const updateWebsiteProgrammesCategoryApi = async (data, id) => {
  const requestObj = {
    path: `/api/program_category/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
// export const editWebsiteProgrammesApi = async (data, id) => {
//   const requestObj = {
//     path: `/api/website_program/${id}`,
//     method: "PUT",
//     headers: {
//       "x-sh-auth": localStorage.getItem("token"),
//     },
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
export const deleteWebsiteProgrammesCategoriesApi = async (id) => {
  const requestObj = {
    path: `/api/program_category/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
