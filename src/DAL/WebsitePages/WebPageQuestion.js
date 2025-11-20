import { invokeApi } from "../../bl_libs/invokeApi";

export const website_questions_list_api = async (id) => {
  let api_path = `/api/website_question`;
  if (id) {
    api_path = `/api/website_question/question_list_by_sale_page/${id}`;
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
export const add_website_question_api = async (data) => {
  const requestObj = {
    path: `/api/website_question/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_website_question_api = async (data, id) => {
  const requestObj = {
    path: `/api/website_question/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const website_question_detail_api = async (id) => {
  const requestObj = {
    path: `/api/website_question/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const delete_website_question_api = async (id) => {
  const requestObj = {
    path: `/api/website_question/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
