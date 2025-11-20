import { invokeApi } from "../../bl_libs/invokeApi";

export const podsDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/room/detail/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const podsListingApi = async (page, rowsPerPage, search) => {
  const requestObj = {
    path: `/api/room?page=${page}&limit=${rowsPerPage}&search=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const podsCastsListingApi = async (search) => {
  const requestObj = {
    path: `/api/website_pods?search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddRoomUserApi = async (data) => {
  const requestObj = {
    path: `/api/room/add_room_user`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditRoomUserApi = async (data) => {
  const requestObj = {
    path: `/api/room/update_room_user`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddPodsApi = async (data) => {
  const requestObj = {
    path: `/api/room`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const AddPodsNewApi = async (data) => {
  const requestObj = {
    path: `/api/room/add_room_new`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditPodsApi = async (data, slug) => {
  const requestObj = {
    path: `/api/room/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const EditNewPodsApi = async (data, slug) => {
  const requestObj = {
    path: `/api/room/update_room_new/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeletePodsApi = async (slug) => {
  const requestObj = {
    path: `/api/room/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeletePodsRoomUserApi = async (roomSlug, id) => {
  const requestObj = {
    path: `/api/room/${roomSlug}/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
