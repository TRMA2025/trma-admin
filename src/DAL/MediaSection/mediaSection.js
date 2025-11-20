import { invokeApi } from "../../bl_libs/invokeApi";

export const mediaListingApi = async () => {
  const requestObj = {
    path: `/api/media_section/`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addMediaApi = async (data) => {
  const requestObj = {
    path: `/api/media_section/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const editMediaApi = async (data, id) => {
  const requestObj = {
    path: `/api/media_section/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteMediaApi = async (id) => {
  const requestObj = {
    path: `/api/media_section/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

// export const teamDetail = async (data) => {
//   const requestObj = {
//     path: `api/team/team_detail.php`,
//     method: "POST",
//     headers: {},
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };

// export const editTeam = async (data) => {
//   const requestObj = {
//     path: `api/team/edit_team.php`,
//     method: "POST",
//     headers: {},
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };

// export const teamDelete = async (data) => {
//   const requestObj = {
//     path: `api/team/delete_team.php`,
//     method: "POST",
//     headers: {},
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };

// export const teamChangePassword = async (data) => {
//   const requestObj = {
//     path: `api/update_password/team_change_password_by_manager.php`,
//     method: "POST",
//     headers: {},
//     postData: data,
//   };
//   return invokeApi(requestObj);
// };
