import { invokeApi } from "../../bl_libs/invokeApi";

export const addNinetyDayQuestionApi = async (data) => {
  const requestObj = {
    path: `/api/ninteen_day_vision_questions/add_question`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const getNinetyDayQuestionApi = async (data) => {
  const requestObj = {
    path: `/api/ninteen_day_vision_questions/get_question`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
