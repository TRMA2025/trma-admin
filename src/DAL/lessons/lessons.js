import { invokeApi } from "../../bl_libs/invokeApi";

export const lessonListingApi = async (slug) => {
  const requestObj = {
    path: `/api/lesson/lesson_list_by_program/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const lesson_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/lesson/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const recordingListApi = async (slug) => {
  const requestObj = {
    path: `/api/lesson_recording/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const recordingDetailApi = async (slug) => {
  const requestObj = {
    path: `/api/lesson_recording/recording_detail/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const AddLessonApi = async (data) => {
  const requestObj = {
    path: `/api/lesson`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddLessonRecordingApi = async (data) => {
  const requestObj = {
    path: `/api/lesson_recording/`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditLessonRecordingApi = async (data, slug) => {
  const requestObj = {
    path: `/api/lesson_recording/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const EditLessonApi = async (data, slug) => {
  const requestObj = {
    path: `/api/lesson/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const lessonDelete = async (slug) => {
  const requestObj = {
    path: `/api/lesson/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const lessonRecordingDelete = async (slug) => {
  const requestObj = {
    path: `/api/lesson_recording/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const lesson_evaluation_detail_api = async (slug) => {
  const requestObj = {
    path: `/api/lesson_note/${slug}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
