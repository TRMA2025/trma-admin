import { invokeApi } from "../../bl_libs/invokeApi";

export const questionListingApi = async () => {
  const requestObj = {
    path: `/api/goal_statement_question`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const getDetailQuestion = async (id) => {
  const requestObj = {
    path: `/api/goal_statement_question/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddQuestion = async (data) => {
  const requestObj = {
    path: `/api/goal_statement_question`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddCommentOnQuestion = async (data) => {
  const requestObj = {
    path: `/api/goal_statement_question/add_comment_on_goal_statement_question`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditQuestion = async (data, id) => {
  console.log(id, "params.id");
  const requestObj = {
    path: `/api/goal_statement_question/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteQuestion = async (id) => {
  const requestObj = {
    path: `/api/goal_statement_question/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
