import { invokeApi } from "src/bl_libs/invokeApi";

export const BookListApi = async (data, load) => {
  const requestObj = {
    path: `/${load}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const BookTagApi = async (page, limit, search) => {
  const requestObj = {
    path: `/api/books_library_tag?page=${page}&limit=${limit}&search_text=${search}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const addTagApi = (data) => {
  const requestObj = {
    path: `/api/books_library_tag`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const deleteTagsApi = async (id) => {
  const requestObj = {
    path: `/api/books_library_tag/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const updateTagsApi = async (id, data) => {
  const requestObj = {
    path: `/api/books_library_tag/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const activeTagsApi = async () => {
  const requestObj = {
    path: `/api/books_library_tag/active`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const addBookApi = (data) => {
  const requestObj = {
    path: `/api/books_library`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const bookDetail = async (data) => {
  const requestObj = {
    path: `/api/books_library/${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const deleteBookApi = async (id) => {
  const requestObj = {
    path: `/api/books_library/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const BokEditApi = async (id, data) => {
  const requestObj = {
    path: `/api/books_library/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
