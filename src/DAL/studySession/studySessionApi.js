import { invokeApi } from "../../bl_libs/invokeApi";

export const studySessionListing = async (data) => {
  const requestObj = {
    path: `/api/study_session/list_study_session`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const studySessionActiveListing = async (data) => {
  const requestObj = {
    path: `/api/study_session/list_study_session_active`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const AddStudySessionApi = async (data) => {
  const requestObj = {
    path: `/api/study_session/add_study_session`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const AddStudySessionRecordingApi = async (data) => {
  const requestObj = {
    path: `/api/study_session_recording/add_study_session_recording`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const DeleteStudySessionApi = async (slug) => {
  const requestObj = {
    path: `/api/study_session/delete_study_session/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const DeleteStudySessionRecordingApi = async (slug) => {
  const requestObj = {
    path: `/api/study_session_recording/delete_study_session_recording/${slug}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const UpdateStudySessionApi = async (data, slug) => {
  const requestObj = {
    path: `/api/study_session/update_study_session/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const UpdateStudySessionRecordingApi = async (data, slug) => {
  const requestObj = {
    path: `/api/study_session_recording/study_session_recording_update/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const studySessionRecordingListing = async (data) => {
  const requestObj = {
    path: `/api/study_session_recording/study_session_recording_list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
